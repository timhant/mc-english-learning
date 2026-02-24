# Changelog | 更新日志

## v2.6.1 (2026-02-24)

### 🐛 Bug Fix — sound_definitions.json 结构修复 | Audio Structure Fix

- **[修复] sound_definitions.json 结构错误** — 868 个音频条目原本错误地写在 JSON 顶层而非 `sound_definitions` 嵌套对象内，导致 Bedrock 引擎无法识别音频定义，表现为大量单词（如 sandstone 等）有 GUI 提示但无语音朗读。修复后全部 868 条目移入 `sound_definitions` 内，category 统一为 `ui`，sounds 格式统一为对象数组。
- **[调整] 冷却时间缩短** — 同类目标物的朗读间隔从 60 秒缩短为 45 秒（`config.js` 中 `cooldownSeconds: 60 → 45`），提高学习频率。
- **新增 vocabulary.js** — 词库辅助文件新增到 scripts 目录。

- **[Fix] sound_definitions.json structure** — 868 audio entries were incorrectly placed at the JSON root level instead of inside the `sound_definitions` nested object, causing Bedrock engine to not recognize audio definitions (words like sandstone showed GUI prompts but no voice). All 868 entries moved inside `sound_definitions`, category unified as `ui`, sounds formatted as object arrays.
- **[Tweak] Cooldown reduced** — Per-word cooldown shortened from 60s to 45s (`cooldownSeconds: 60 → 45`), increasing learning frequency.
- **New vocabulary.js** — Added vocabulary helper file to scripts directory.

---

## v2.6.0 (2026-02-23)

### Quest System Upgrade | 任务系统升级

- **Block quests** — quests now include "⛏ DIG: {block}" in addition to "🔍 FIND: {entity}"
- **50/50 mix** — random selection between entity and block quests
- **Dual completion** — block quests complete on break OR place

- **方块任务** — 任务系统新增「⛏ 挖掘：{方块}」类型，与原有「🔍 找到：{生物}」并行
- **随机混合** — 实体任务和方块任务各占 50%
- **双向完成** — 挖掘或放置目标方块均可完成任务

---

## v2.5.0 (2026-02-23)

### 🚀 Major Update — 434 Words & Gameplay-Progression Levels | 434词库 & 游戏进程分级

- **434 Words** — expanded from 156 to 434 words (278 new words)
- **5-Level Gameplay Progression** — levels now mirror natural Minecraft journey:
  - Lv1: First Day (~100 words)
  - Lv2: First Week (~100 words)
  - Lv3: Exploration (~100 words)
  - Lv4: Nether Journey (~100 words)
  - Lv5: The End (~34 words)
- **Item Trigger** — switch held items to learn their names (3rd trigger type alongside entity proximity & block break/place)
- **Playback Lock** — global 4-second audio lock prevents overlapping narration
- **Out-of-Level Lightweight Experience** — words above current level still trigger (ActionBar + voice) but without celebration/XP, so curiosity isn't punished
- **Edge TTS Audio Regeneration** — all 868 audio files regenerated using Microsoft Edge TTS (en-US-JennyNeural + zh-CN-XiaoxiaoNeural)

- **434 个单词** — 从 156 词扩充到 434 词（新增 278 词）
- **5 级游戏进程分级** — 等级按游戏自然进程划分：
  - Lv1：第一天（~100 词）
  - Lv2：第一周（~100 词）
  - Lv3：探索期（~100 词）
  - Lv4：下界征途（~100 词）
  - Lv5：终末之地（~34 词）
- **物品触发** — 切换手持物品触发学习（第 3 种触发方式，与实体靠近、方块挖掘/放置并列）
- **播放锁** — 全局 4 秒音频锁，防止语音重叠播放
- **超纲词轻量体验** — 高于当前等级的词仍可触发（ActionBar + 语音），但不触发庆祝/经验值，满足好奇心不增加负担
- **Edge TTS 音频重新生成** — 全部 868 个音频文件使用 Microsoft Edge TTS 重新生成（en-US-JennyNeural + zh-CN-XiaoxiaoNeural）

---

## v2.0.0 (2026-02-23)

### 🚀 Major Update — Voice & Leveling System | 语音朗读 & 分级系统

- **Voice Narration** — 312 TTS audio files (EN: JennyNeural, CN: XiaoxiaoNeural), every word read aloud in English then Chinese
- **5-Level Progression** — words organized into themed levels (Farm Life → Exploring Nature → Miner's Path → Brave Fighter → Master Workshop)
- **156 Words** — expanded from 55 to 156 words across 5 levels
- **Level-Up System** — unlock 80% of current level to advance, with celebration animation
- **Resource Pack** — new `EnglishLearning_RP` with all audio assets
- **Config File** — external `config.json` for customizable settings
- **Bug Fix** — playsound coordinates now use player position instead of world origin

- **语音朗读** — 312 个 TTS 音频文件，每个单词先读英文再读中文
- **5 级进阶系统** — 按主题分级（农场生活→探索自然→矿工之路→勇者战斗→大师工坊）
- **156 个单词** — 从 55 词扩充到 156 词
- **升级系统** — 解锁当前等级 80% 单词即可升级，触发庆祝动画
- **资源包** — 新增 `EnglishLearning_RP` 包含所有音频
- **配置文件** — 外置 `config.json` 支持自定义设置
- **Bug 修复** — playsound 坐标改为使用玩家位置

---

## v1.0.0 (2026-02-22)

### 🎉 Initial Release | 首次发布

- **Animal Encounter** — 25 animals with EN/CN/phonetic display on proximity
- **Block Learning** — 30 common blocks shown on break/place
- **Auto Quests** — automatic find-the-animal quests every 5 minutes
- **Word Album** — `/words` command to check collection progress
- **Progress Persistence** — saved via Dynamic Properties

- **动物邂逅** — 25 种动物，靠近时显示英文/中文/音标
- **方块学习** — 30 种常见方块，挖掘/放置时显示
- **自动寻宝** — 每 5 分钟自动发布找动物任务
- **单词图鉴** — `/words` 命令查看收集进度
- **进度持久化** — 通过 Dynamic Properties 保存
