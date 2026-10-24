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
- `src/data/diaries/YYYY.json`：飞书历史日记原文，按年归档，保留原文段落、标题、图片与来源分组。
- `src/data/diary-index.json`：年度注册与目录统计；跨年原文保留日期范围，不编造缺失年份。
- `src/data/imports.json`：公开导入条目；保留来源及归属。
- `src/data/updates.json`：实际更新事件；补写旧日期时，首页与 RSS 链接到被更新的日期。
- `src/data/research.json`：Atlas 的 71 个研究原型，参考案例链接到来源。
- `public/media/`：公开采用的显示图片；原图和私人素材不放这里。
- `.private/`：本地原始输入、API 响应、素材令牌与原文件，Git 忽略。用户已明确授权将全部历史日记原文与图片发布到网站；公开数据由这些来源转换而来，不包含 API 响应或鉴权令牌。

## 日记命令

```sh
# 私人收录，不改公开稿
npm run diary -- --date 2026-10-25 --title 当日主题 --file prepared.md
# 发布经整理的完整当日稿；同日更新同一个日期节点
npm run diary -- --date 2026-10-25 --title 当日主题 --file prepared.md --topics 选择战略,赚钱能力 --publish --replace
```

Markdown 文件应由本人或 Codex 按本人的实际表达准备。命令支持历年和新年度，自动维护年度注册。历史导入的原文默认保留；网站新日记自动按日期接入主日记的对应阶段，正文和目录使用同一顺序，不显示独立的“网站新增记录”分组。同日补充继续更新原有网站节点，正文事实段统一使用 `ziye：`。源快照与网站稿仅在数据存储中分开，以便重新导入时保留。如需修改历史原文，应先按用户指令修改飞书来源，再重新导入；生成的年度 JSON 不作为原文编辑入口。

### 独立日记与标题格式

TRC 日记 `/content/diary-trc/` 与西风日记 `/content/diary-xifeng/` 独立展示，各有正文、目录与搜索入口，不包含在 2026 年主日记中。新增系列内容使用同一命令加 `--series trc` 或 `--series xifeng`；同一天的三种日记分别聚合，不互相覆盖。

网站新记录的标题自动显示为 `Day序号 YYYY.M.D 当天主题`，已有日期范围会保留。例如主日记从 Day228 继续，10/21、10/22、10/25 分别显示 Day229、Day230、Day231。同日补充沿用当天序号；补写日期按时间顺序重新接续。不要手动修改历史原文的 Day 编号。

## 历史原文刷新

```sh
# 默认从本机快照继续；--refresh 重新读取已登记来源
python3 scripts/fetch-lark-archive.py --refresh
python3 scripts/fetch-diary-media.py
python3 scripts/build-diary-archive.py
npm run build
```

新增来源时先用 lark-cli 更新 `.private/archive/nodes.json` 的日记根目录清单；抓取失败应停止，不能用旧快照冒充刷新成功。网站新增记录独立保存，重建原文时保留已有记录及锚点。

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

历史日记来源为用户指定飞书日记根目录中的全部 15 份文档。2012—2026 年均有年度入口，2014 年因源合并文档缺少可独立识别条目，明确展示归档说明。全部 2,681 张正文图片及 8 张画板已下载为显示资源，原文附带约 5.6GB 视频，另有 PDF 等附件，保留飞书原文入口，需要相应访问权限。

所有年度正文和显示图片都在网站内提供。压缩显示图片约 529MiB，保留原图比例；原文件不加入 Git。历史原文保留引用与原有用语，不改写为摘要。日常新增输入的私有指令仍优先。

单独的视频日记页面目前有真实封面与主题，尚未取得公开播放地址。邮件订阅和群发、访问统计与 AI 讲解未接入，订阅使用 RSS；不生成虚假数据。

自然语言规则存于用户本地 `ziye-diary` skill，并在项目入口登记；没有后台消息监听。
