# 已验证不适合收录的 Skills

记录经过评估后决定不收录的 skill，避免重复调研。

| Skill | 来源 | 拒绝原因 | 评估日期 |
|-------|------|----------|----------|
| CodeConductor.AI | https://clawhub.ai/larsonreever/codeconductor | 仅有一个能力清单文件，无实际指令、无 API 集成、无配置细节；ClawHub 安全扫描标记为可疑。经两位维护者独立评估，结论一致。| 2026-04-05 |
| MoltSpeak | https://clawhub.ai/skills/moltspeak | 纯协议规范文档，无可执行逻辑；依赖外部 npm 包 @moltspeak1/sdk（ClawHub 标记为可疑）；GitHub 源码已 404；实际用户仅 1 人。| 2026-04-05 |
| CLI (@mondilo1) | https://clawhub.ai/skills/cli | 安全扫描高置信度可疑；仅 1 个实际用户；依赖未声明的 moltbot CLI。| 2026-04-05 |
| Scheduler for Discord | https://clawhub.ai/skills/scheduler-for-discord | 安全高置信度可疑；0 实际用户；隐含依赖 moltbot CLI 和 Discord 频道配置但未声明。| 2026-04-05 |
| Feishu Evolver Wrapper | https://clawhub.ai/skills/feishu-evolver-wrapper | 安全可疑（VirusTotal + OpenClaw）；依赖本地 file:../evolver 包；存在 shell 注入风险；未声明多个飞书凭证依赖。| 2026-04-05 |
| YouTube Transcript | https://clawhub.ai/skills/youtube-transcript | 安全可疑；需要 root 权限修改系统网络路由（WireGuard）；通过住宅 IP 绕过 YouTube 限制，存在合规风险。| 2026-04-05 |
| Baidu Web Search | https://clawhub.ai/skills/baidu-web-search | 安全可疑；检测到环境变量读取与网络发送组合（潜在数据泄露模式）。| 2026-04-05 |
