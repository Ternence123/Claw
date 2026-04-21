# 长期记忆

## 用户偏好
- 用户自称"老板"，AI 应称呼用户为"老板"
- 用户使用飞书与 WorkBuddy 通信
- 用户所在城市：昆山（江苏省）

## OpenClaw 配置
- 配置文件路径：`C:\Users\Administrator\.openclaw\openclaw.json`
- 当前默认模型：`kimi/kimi-k2.5`（已配置 API Key: sk-M7KO6ADJ557SUK6PCDKND2HAUX）
- Gateway 端口：18789
- 群聊消息响应范围：`group-all`（群内所有消息均回复）
- 飞书插件：`openclaw-lark` 已安装并启用
- 飞书 App 凭据：`cli_a96b65d366fa9bd2`（2026-04-17 更新，当前生效）
- **启动方式**：`openclaw gateway --port 18789`（本地 npm 全局安装）

## OpenClaw 本地全局安装修复记录（2026-04-09）
- 问题：npm 全局安装 openclaw 时报 EBUSY 锁定错误
- 原因：`@matrix-org\matrix-sdk-crypto-nodejs` 目录被 node 进程锁定
- 解决方案：
  1. 关闭所有 node 进程：`Stop-Process -Name "node" -Force`
  2. 用 Windows rmdir 强制删除目录：`cmd /c "rmdir /s /q C:\Users\Administrator\AppData\Roaming\npm\node_modules\openclaw"`
  3. 清理 npm 缓存：`npm cache clean --force`
  4. 重新安装：`npm install -g openclaw`
- 结果：✅ 成功安装 OpenClaw 2026.4.9，飞书插件正常工作

## 操作记录
- 2026-03-25：配置飞书机器人，开启群聊全量消息回复，安装 kimi-claw 插件
- 2026-03-26：确认模型已为 kimi/kimi-k2.5，无需修改
- 2026-04-09：解决 openclaw npm 全局安装 EBUSY 问题，成功安装 2026.4.9 版本
