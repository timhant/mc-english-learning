# 🎓 MC English Learning | 我的世界英语启蒙

[![Minecraft Bedrock](https://img.shields.io/badge/Minecraft-Bedrock%201.21.60%2B-green?logo=minecraft)](https://www.minecraft.net/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Script API](https://img.shields.io/badge/Script%20API-2.0.0-orange)](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/)

**Learn English while playing Minecraft! 边玩我的世界，边学英语！**

A Minecraft Bedrock Edition addon that helps **preschool and early-school children (ages 5-8)** learn English vocabulary naturally through gameplay. No textbooks, no pressure — just explore the world and discover words, with **voice narration** for every word.

专为 **5-8 岁学龄前及低龄儿童** 设计的我的世界基岩版英语启蒙模组。不用课本、不用死记，在探索世界的过程中自然地学会英语单词，每个单词都有**真人语音朗读**。

---

[English](#features) | [中文说明](#功能介绍)

---

## Features

### 🐄 Animal Encounter
Walk near any animal and its English name, Chinese translation, and phonetic spelling appear on screen. First discovery triggers a special "New Word Unlocked!" celebration with sound effects and XP.

### ⛏️ Block Learning
Mine or place blocks to see their English names. Common blocks, ores, redstone components — all labeled automatically.

### 🔊 Voice Narration *(NEW in v2.0)*
Every word is read aloud in **English first, then Chinese** — helping children connect pronunciation with meaning. 312 high-quality TTS audio files powered by Microsoft Edge TTS.

### 📈 5-Level Progression System *(NEW in v2.0)*
Words are organized into 5 themed levels that unlock as children explore:

| Level | Theme | Words |
|:---:|:---|:---:|
| ⭐ Lv1 | Farm Life — animals, basic blocks, furniture | 27 |
| ⭐⭐ Lv2 | Exploring Nature — wildlife, plants, trees | 36 |
| ⭐⭐⭐ Lv3 | Miner's Path — ores, tools, crafting stations | 28 |
| ⭐⭐⭐⭐ Lv4 | Brave Fighter — monsters, combat, enchanting | 30 |
| ⭐⭐⭐⭐⭐ Lv5 | Master Workshop — redstone, nether, end, advanced | 35 |
| | **Total** | **156** |

Unlock 80% of words in your current level to advance to the next!

### 🔍 Auto Quests
Every 5 minutes, a "Find the Animal" quest appears automatically. Find the target animal to earn food rewards and XP. No typing required — perfect for kids who can't read yet.

### 📖 Word Album
Parents can type `/words` to check their child's collection progress. Like a Pokédex but for English words!

### ✨ Designed for Kids
- **Zero typing required** — everything is automatic or proximity-based
- **Bilingual display** — English + Chinese + phonetic symbols
- **Voice narration** — hear every word spoken in English and Chinese
- **Positive reinforcement** — sounds, particles, XP, and item rewards
- **Non-intrusive** — enhances normal gameplay, doesn't interrupt it
- **60-second cooldown** — won't spam the same word repeatedly

---

## 功能介绍

### 🐄 动物邂逅
走到动物旁边，屏幕自动显示英文名、中文名和音标。第一次发现新动物会触发「新单词解锁」特效，伴随音效和经验值奖励。

### ⛏️ 方块学习
挖掘或放置方块时，ActionBar 自动显示英文名称。覆盖基础方块、矿石、红石组件等。

### 🔊 语音朗读 *（v2.0 新增）*
每个单词都会**先朗读英文，再朗读中文**——帮助孩子将发音与含义建立联系。312 个高品质语音文件，由 Microsoft Edge TTS 生成。

### 📈 5 级进阶系统 *（v2.0 新增）*
单词按主题分为 5 个等级，随着探索逐步解锁：

| 等级 | 主题 | 词数 |
|:---:|:---|:---:|
| ⭐ Lv1 | 农场生活 — 动物、基础方块、家具 | 27 |
| ⭐⭐ Lv2 | 探索自然 — 野生动物、植物、树木 | 36 |
| ⭐⭐⭐ Lv3 | 矿工之路 — 矿石、工具、工作站 | 28 |
| ⭐⭐⭐⭐ Lv4 | 勇者战斗 — 怪物、战斗、附魔 | 30 |
| ⭐⭐⭐⭐⭐ Lv5 | 大师工坊 — 红石、下界、末地、高级建筑 | 35 |
| | **总计** | **156** |

解锁当前等级 80% 的单词即可升级到下一级！

### 🔍 自动寻宝
每 5 分钟自动发布一个「找动物」任务，找到目标动物就能获得食物和经验值奖励。不需要打字——完全适合不识字的小朋友。

### 📖 单词图鉴
家长输入 `/words` 可以查看孩子的单词收集进度，像宝可梦图鉴一样！

### ✨ 为儿童设计
- **零打字需求** — 全部自动触发或靠近触发
- **双语显示** — 英文 + 中文 + 音标
- **语音朗读** — 每个单词都有英文和中文语音
- **正向激励** — 音效、粒子特效、经验值、物品奖励
- **不打断游戏** — 增强玩法，不干扰正常游戏体验
- **60 秒冷却** — 同一单词不会重复刷屏

---

## 🚀 Installation | 安装方法

### For BDS (Dedicated Server) | 服务器安装

1. Download or clone this repository | 下载或克隆本仓库

2. Copy `EnglishLearning_BP` to `behavior_packs/` and `EnglishLearning_RP` to `resource_packs/`
   将 `EnglishLearning_BP` 复制到 `behavior_packs/`，`EnglishLearning_RP` 复制到 `resource_packs/`

3. Add to your world's `world_behavior_packs.json`:
```json
{
  "pack_id": "a3f1d7e2-8c4b-4f6a-9d2e-1b5c8a3f7e90",
  "version": [2, 0, 0]
}
```

4. Add to your world's `world_resource_packs.json`:
```json
{
  "pack_id": "b4e2c8f1-7d3a-5e9b-8f1c-2a6d9b4e7f01",
  "version": [2, 0, 0]
}
```

5. Enable **Beta APIs / Experiments** in your world | 启用 Beta APIs / 实验功能

6. Restart the server | 重启服务器

### For Single Player | 单人游戏

1. Copy both `EnglishLearning_BP` and `EnglishLearning_RP` to your packs directories:
   - **Windows**: `%localappdata%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\`
   - **Android**: `/storage/emulated/0/Android/data/com.mojang.minecraftpe/files/games/com.mojang/`
   - **iOS**: `Minecraft/games/com.mojang/`

2. Create a new world or edit existing → activate both behavior pack and resource pack
   创建新世界或编辑已有世界，激活行为包和资源包

3. Enable **Beta APIs** in Experiments | 启用 Beta APIs

---

## 🎮 Usage | 使用方法

| Action 操作 | Result 效果 |
|:---|:---|
| Walk near an animal 走近动物 | Name displayed + English & Chinese voice 显示名称 + 英中语音朗读 |
| Mine/place a block 挖掘/放置方块 | Block name + voice on ActionBar 方块名称 + 语音 |
| Wait 5 minutes 等待5分钟 | Auto quest appears 自动寻宝任务出现 |
| Type `/words` 输入 `/words` | View word album & level progress 查看单词图鉴和等级进度 |

**Tip for parents 家长提示**: Play together with your child! The voice narration reads each word aloud so even parents who aren't confident in English can learn alongside their kids.

**家长提示**：和孩子一起玩！语音朗读会读出每个单词，即使家长英语不太好也能和孩子一起学习。

---

## 🏗️ Project Structure | 项目结构

```
EnglishLearning_BP/          # Behavior Pack (logic)
├── manifest.json
├── config.json               # Configurable settings (cooldown, range, etc.)
└── scripts/
    ├── main.js               # Entry point, event registration
    ├── config.js             # Config reader
    ├── proximity.js          # Entity proximity detection (2 blocks)
    ├── blockLearn.js         # Block break/place learning
    ├── quest.js              # Auto find-the-animal quests
    ├── progress.js           # Player progress tracking
    ├── levelUp.js            # Level-up celebration & rewards
    ├── voice.js              # Voice playback (EN then CN)
    └── vocab/
        ├── index.js          # Vocabulary aggregator
        ├── level1.js ~ level5.js  # Word definitions per level

EnglishLearning_RP/          # Resource Pack (audio)
├── manifest.json
└── sounds/
    ├── sound_definitions.json
    └── eng/                  # 312 audio files (156 words × 2)
        ├── cow_en.ogg
        ├── cow_cn.ogg
        └── ...
```

---

## ⚙️ Configuration | 配置

Edit `EnglishLearning_BP/config.json`:

```json
{
  "unlockThreshold": 0.8,      // 80% words to level up
  "cooldownSeconds": 60,        // Per-word cooldown
  "detectRange": 2,             // Entity detection range (blocks)
  "questIntervalSeconds": 300,  // Quest frequency (5 min)
  "questTimeoutSeconds": 300,   // Quest timeout
  "voiceEnabled": true,         // Toggle voice narration
  "maxLevel": 5                 // Maximum level
}
```

---

## 🛠️ Technical Details | 技术细节

- **Platform**: Minecraft Bedrock Edition 1.21.60+
- **API**: `@minecraft/server` 2.0.0 (Script API)
- **Audio**: 312 OGG files, Microsoft Edge TTS (JennyNeural EN + XiaoxiaoNeural CN)
- **Multiplayer compatible** — each player has independent progress
- **Lightweight** — proximity check runs once per second, minimal performance impact
- **Data persistence** — progress saved via Dynamic Properties (survives server restarts)

---

## 🤝 Contributing | 参与贡献

Contributions are welcome! Some ideas:

- 📚 **Expand vocabulary** — food, tools, biomes, weather, more creatures...
- 🌍 **Add more languages** — Japanese, Korean, Spanish, French...
- 🎨 **Resource pack UI** — custom learning-themed textures
- 📱 **Testing** — different platforms (iOS, Android, Windows, Xbox)
- 🐛 **Bug reports** — file issues on GitHub

欢迎贡献！可以参与的方向：扩充词库、多语言支持、UI 美化、跨平台测试、反馈 Bug。

---

## 📜 License | 许可证

[MIT License](LICENSE) — free to use, modify, and distribute.

---

## 💡 Inspiration | 灵感来源

**The best way to learn is through play.** Minecraft is already one of the most popular games among children worldwide. Instead of adding another "educational app," let's make the game they already love into a learning tool.

**最好的学习方式是在玩中学。** 与其再增加一个教育 App，不如把孩子已经喜爱的游戏变成学习工具。

> "小孩为了搞清楚大神的视频在说什么，主动学英语硬啃英文字幕。"
> — A parent's observation on X/Twitter

---

Made with ❤️ for kids who love Minecraft
为热爱我的世界的小朋友们用心制作
