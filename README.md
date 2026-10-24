# Ziye · 选择、实践与价值

Next.js 16 静态个人网站，参考 ranchen.org 的页面布局，以本人内容替换。包含首页、内容归档、年度日记、项目、进展、研究、工具、合作、每周进展和 3D 展馆。

## 启动

```sh
npm ci
npm run dev
```

本机地址 `http://127.0.0.1:3100`。`npm run build` 生成 `out/`，`npm start` 提供静态预览。`.github/workflows/pages.yml` 在推送 main 时构建并部署 GitHub Pages。

## 内容

- `src/lib/content.ts`：本站公开内容元数据、项目和网站配置。
- `src/data/diary-2026.json`：整理后的年度公开稿，每天一个稳定节点。
- `src/data/imports.json`：公开导入条目；保留来源及归属。
- `src/data/updates.json`：实际更新事件；补写旧日期时，首页与 RSS 链接到被更新的日期。
- `src/data/research.json`：Atlas 的 71 个研究原型，参考案例链接到来源。
- `public/media/`：公开采用的显示图片；原图和私人素材不放这里。
- `.private/`：本地原始输入、导入快照和完整日记预览，Git 忽略。生产构建始终只使用公开稿。

## 日记命令

```sh
# 私人收录，不改公开稿
npm run diary -- --date 2026-10-25 --title 当日主题 --file prepared.md
# 发布经整理的完整当日稿；同日更新同一个日期节点
npm run diary -- --date 2026-10-25 --title 当日主题 --file prepared.md --topics 选择战略,赚钱能力 --publish --replace
```

Markdown 文件应由本人或 Codex 先整理为公开稿。命令不负责判断个人隐私、核实引用归属或替代编辑。当前命令只登记 2026；迁移其他年份时需要扩展路由注册。

## 链接导入

```sh
# 默认仅生成私人草稿
npm run import:link -- https://example.com/article
# 本人原创内容全文导入
npm run import:link -- https://example.com/mine --ownership own --mode full --author Ziye --date 2026-10-25 --publish
# 第三方内容发布本人研究摘要，保留原文
npm run import:link -- https://example.com/reference --ownership research --author 原作者 --note-file my-note.md --publish
```

抓取有读取失败、平台登录与反爬限制。失败时使用授权导出或链接卡片，不绕过权限。未知原始日期在内页明确标注，不将导入日冒充原始发布日期。

## 当前版本的真实边界

公开年度日记是已整理的节选，完整原始年度图文只用于本机预览。视频目前只有主题与封面，尚未接入公开播放地址。订阅使用 RSS，邮件订阅和群发尚未开放。没有虚构访问量、收入或客户数据，也没有 AI 讲解服务。展馆可实际走动、传送、检索和打开作品。

完整日记开发预览需要本地 `.private/diary-2026.json` 与私人图片服务，并显式设置 `LOCAL_DIARY_PREVIEW=1`；此模式仅在 development 生效。不要把私人图片目录放进 public 或公开预览服务。

自然语言规则存于用户本地 `ziye-diary` skill，并在项目入口登记；没有后台消息监听。
