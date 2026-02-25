# 🎓 MC English Learning | 我的世界基岩版英语启蒙 Addon

[![Minecraft Bedrock](https://img.shields.io/badge/Minecraft-Bedrock%201.21.60%2B-green?logo=minecraft)](https://www.minecraft.net/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Script API](https://img.shields.io/badge/Script%20API-2.0.0-orange)](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/)
[![Version](https://img.shields.io/badge/Version-3.0.1-brightgreen)]()

**Learn English while playing Minecraft! 边玩我的世界，边学英语！**

A Minecraft Bedrock Edition addon that helps **preschool and early-school children (ages 5-8)** learn English vocabulary naturally through gameplay. No textbooks, no pressure — just explore the world and discover words, with **voice narration** for every word.

专为 **5-8 岁学龄前及低龄儿童** 设计的我的世界基岩版英语启蒙模组。不用课本、不用死记，在探索世界的过程中自然地学会英语单词和短语，每个单词都有**真人语音朗读**。

---

[English](#features) | [中文说明](#功能介绍)

---

## Features

### 📚 484 Words — 5-Level Gameplay Progression

Words are organized into 5 levels that mirror natural Minecraft progression:

| Level | Theme | Words |
|:---:|:---|:---:|
| ⭐ Lv1 | First Day — farm animals, basic blocks, first night | 96 |
| ⭐⭐ Lv2 | First Week — building, mining, villagers, early farms | 118 |
| ⭐⭐⭐ Lv3 | Exploration — biomes, ruins, hostile mobs, deep caves | 95 |
| ⭐⭐⭐⭐ Lv4 | Nether Journey — nether mobs, brewing, enchanting | 70 |
| ⭐⭐⭐⭐⭐ Lv5 | The End — endgame content, rare blocks, final boss | 55 |
| | + v2.7 Supplementary | 49 |
| | **Total** | **484** |

Unlock 80% of words in your current level to advance!

### 💬 156 Action Phrases

4 types of action-triggered English phrases:

- **Kill phrases** — *"Kill a zombie!"* 击杀僵尸
- **Mine/Place phrases** — *"Mine some stone"* 挖一些石头
- **Food phrases** — *"Eat an apple"* 吃一个苹果
- **Weather/Status phrases** — *"It's raining"* 下雨了

### 🐄 Three Noun Trigger Methods

| Trigger | How | Example |
|:---|:---|:---|
| **Entity Proximity** | Walk near an animal/mob (2 blocks) | 🐄 Walk near a cow → "Cow 奶牛" |
| **Block Interaction** | Mine or place a block | ⛏ Mine stone → "Stone 石头" |
| **Item Switching** | Switch your held item | 🎒 Hold a sword → "Sword 剑" |

### 🎯 Display System

- **New Word Unlock**: Full-screen title + phonetics + celebration sound + XP reward
- **Daily Review**: Custom HUD text at top of screen (via JSON UI Override, avoids overlapping with native item names)
- **Out-of-Level Words**: Gray dimmed display, lightweight experience — curiosity never punished

### 🔍 Quest System

Auto quests every 5 minutes — find an entity or mine/place a block. Rewards food items and XP. Zero typing required — perfect for kids who can't read yet.

### 🔊 Audio System

- **Bilingual TTS**: English first (JennyNeural), then Chinese (XiaoxiaoNeural)
- **1276+ audio files** via Microsoft Edge TTS
- **Playback lock** (2s) prevents audio overlap — clean, calm, child-friendly

### 📖 Word Album

Parents type `/words` to check collection progress — like a Pokédex for English words!

---

## 功能介绍

### 📚 484 个单词 — 5 级游戏进程分级

| 等级 | 主题 | 词数 |
|:---:|:---|:---:|
| ⭐ Lv1 | 第一天 — 农场动物、基础方块、第一夜 | 96 |
| ⭐⭐ Lv2 | 第一周 — 建造、挖矿、村民、早期农场 | 118 |
| ⭐⭐⭐ Lv3 | 探索期 — 生态群系、遗迹、敌对怪物、深层洞穴 | 95 |
| ⭐⭐⭐⭐ Lv4 | 下界征途 — 下界生物、药水酿造、附魔 | 70 |
| ⭐⭐⭐⭐⭐ Lv5 | 终末之地 — 末地内容、稀有方块、最终 Boss | 55 |
| | + v2.7 补充词汇 | 49 |
| | **总计** | **484** |

解锁当前等级 80% 单词即可升级！

### 💬 156 条动作短语

4 类动作触发英语短语：
- **击杀短语** — *"Kill a zombie!"* 击杀僵尸
- **挖掘/放置短语** — *"Mine some stone"* 挖一些石头
- **食物短语** — *"Eat an apple"* 吃一个苹果
- **天气/状态短语** — *"It's raining"* 下雨了

### 🐄 三种名词触发方式

| 触发方式 | 操作 | 示例 |
|:---|:---|:---|
| **实体靠近** | 走近动物/怪物（2格内） | 🐄 走近牛 → "Cow 奶牛" |
| **方块交互** | 挖掘或放置方块 | ⛏ 挖石头 → "Stone 石头" |
| **物品切换** | 切换手持物品 | 🎒 手持剑 → "Sword 剑" |

### 🎯 显示系统

- **新词解锁**：屏幕中央大字标题 + 音标 + 庆祝音效 + 经验值奖励
- **日常复习**：屏幕上方自定义 HUD 小字提示（通过 JSON UI Override 实现，避免与游戏原生物品名称重叠）
- **超纲词**：灰色淡化显示，轻量体验 — 好奇心不会被辜负

### 🔊 音频系统

- **双语 TTS**：先英文（JennyNeural），后中文（XiaoxiaoNeural）
- **1276+ 音频文件**，Microsoft Edge TTS 生成
- **播放锁**（2秒）防止音频重叠 — 干净、平静、儿童友好

---

## 🚀 Installation | 安装方法

### For BDS (Dedicated Server) | 服务器安装

1. Download or clone this repository | 下载或克隆本仓库

2. Copy packs to server directories:
   ```
   EnglishLearning_BP → behavior_packs/
   EnglishLearning_RP → resource_packs/
   ```

3. Add to `world_behavior_packs.json`:
   ```json
   { "pack_id": "a3f1d7e2-8c4b-4f6a-9d2e-1b5c8a3f7e90", "version": [3, 0, 1] }
   ```

4. Add to `world_resource_packs.json`:
   ```json
   { "pack_id": "b4e2c8f1-7d3a-5e9b-8f1c-2a6d9b4e7f01", "version": [3, 0, 1] }
   ```

5. **Enable Beta APIs / Experiments** in your world | 启用 Beta APIs 实验功能

6. Restart the server | 重启服务器

### For Single Player | 单人游戏

1. Copy both packs to your Minecraft packs directory:
   - **Windows**: `%localappdata%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\`
   - **Android**: `/storage/emulated/0/Android/data/com.mojang.minecraftpe/files/games/com.mojang/`
   - **iOS**: `Minecraft/games/com.mojang/`

2. Create/edit world → activate both behavior pack and resource pack

3. Enable **Beta APIs** in Experiments

---

## 🎮 Usage | 使用方法

| Action | Result |
|:---|:---|
| Walk near an animal/mob 走近动物 | Name + voice narration 名称 + 语音朗读 |
| Mine/place a block 挖掘/放置方块 | Block name + voice 方块名称 + 语音 |
| Switch held item 切换手持物品 | Item name + voice 物品名称 + 语音 |
| Jump/eat/attack/sneak… 跳跃/吃/攻击/潜行 | English phrase + voice 英语短语 + 语音 |
| Wait 5 minutes 等待5分钟 | Auto quest 自动任务 |
| `/words` | View word album 查看单词图鉴 |

**Tip for parents**: Play together! Voice narration reads everything aloud — even parents who aren't confident in English can learn alongside their kids.

---

## 🏗️ Project Structure | 项目结构

```
EnglishLearning_BP/              # Behavior Pack (logic)
├── manifest.json
├── config.json                   # Runtime settings
└── scripts/
    ├── main.js                   # Entry point, event registration
    ├── config.js                 # Config reader
    ├── proximity.js              # Entity proximity detection
    ├── blockLearn.js             # Block break/place learning
    ├── itemLearn.js              # Item hold/switch learning
    ├── phraseLearn.js            # Action phrase triggers
    ├── quest.js                  # Auto quests
    ├── progress.js               # Player progress tracking
    ├── levelUp.js                # Level-up celebration & rewards
    ├── voice.js                  # Voice playback + playback lock
    └── vocab/
        ├── index.js              # Vocabulary aggregator
        ├── level1.js ~ level5.js # Word definitions per level
        └── phrases.js            # 156 action phrases

EnglishLearning_RP/              # Resource Pack (audio + UI)
├── manifest.json
├── ui/
│   └── hud_screen.json           # Custom HUD positioning (JSON UI Override)
└── sounds/
    ├── sound_definitions.json
    └── eng/                      # 1276+ audio files
```

---

## ⚙️ Configuration | 配置

Edit `EnglishLearning_BP/config.js`:

| Setting | Default | Description |
|:---|:---:|:---|
| `cooldownSeconds` | 5 | Noun/phrase shared cooldown 名词/短语冷却 |
| `outOfLevelCooldown` | 120 | Out-of-level word cooldown 超纲词冷却 |
| `playLockTicks` | 40 | Audio playback lock (~2s) 语音播放锁 |
| `detectRange` | 2 | Entity detection range (blocks) 实体检测范围 |
| `questIntervalSeconds` | 300 | Quest frequency (5 min) 任务间隔 |
| `voiceEnabled` | true | Toggle voice narration 语音开关 |

---

## 🛠️ Technical Details | 技术细节

- **Platform**: Minecraft Bedrock Edition 1.21.60+
- **API**: `@minecraft/server` 2.0.0 (Script API)
- **Audio**: 1276+ OGG files, Microsoft Edge TTS
- **Vocabulary**: 484 words (5 levels) + 156 action phrases
- **Triggers**: Entity proximity · Block break/place · Item switch · Player actions
- **Display**: Custom JSON UI Override for HUD repositioning
- **Cooldown**: Shared cooldown pool (nouns & phrases, phrases prioritized)
- **Progress**: Dynamic Properties (survives restarts)
- **Multiplayer**: Each player has independent progress
- **Performance**: Proximity check once per second, minimal impact

---

## 🤝 Contributing | 参与贡献

Contributions welcome! Ideas: expand vocabulary, add languages (Japanese/Korean/Spanish/French), UI improvements, cross-platform testing, bug reports.

欢迎贡献！方向：扩充词库、多语言支持、UI 美化、跨平台测试、反馈 Bug。

---

## 📜 License

[MIT License](LICENSE)

---

Made with ❤️ for kids who love Minecraft
为热爱我的世界的小朋友们用心制作
