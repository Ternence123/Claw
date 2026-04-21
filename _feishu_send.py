import urllib.request, json

# 飞书自定义机器人 Webhook - 请替换为你的实际 token
# 获取方式：飞书群设置 → 群机器人 → 添加机器人 → 复制 Webhook 地址中的 token
webhook_token = "YOUR_WEBHOOK_TOKEN_HERE"  # <-- 替换这里
url = f"https://open.feishu.cn/open-apis/bot/v2/hook/{webhook_token}"

payload = {
    "msg_type": "text",
    "content": {
        "text": "测试消息：飞书机器人连接成功！"
    }
}

data = json.dumps(payload).encode("utf-8")
req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
try:
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        print(json.dumps(result, ensure_ascii=False, indent=2))
except Exception as e:
    print(f"Error: {e}")
