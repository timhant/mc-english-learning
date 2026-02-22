# 🎓 MC English Learning | 我的世界英语启蒙

[![Minecraft Bedrock](https://img.shields.io/badge/Minecraft-Bedrock%201.21.60%2B-green?logo=minecraft)](https://www.minecraft.net/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Script API](https://img.shields.io/badge/Script%20API-2.0.0-orange)](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/)

**Learn English while playing Minecraft! 边玩我的世界，边学英语！**

A Minecraft Bedrock Edition addon that helps **preschool and early-school children (ages 5-8)** learn English vocabulary naturally through gameplay. No textbooks, no pressure — just explore the world and discover words.

专为 **5-8 岁学龄前及低龄儿童** 设计的我的世界基岩版英语启蒙模组。不用课本、不用死记，在探索世界的过程中自然地学会英语单词。

---

[English](#features) | [中文说明](#功能介绍)

---

## Features

### 🐄 Animal Encounter
Walk near any animal and its English name, Chinese translation, and phonetic spelling appear on screen. First discovery triggers a special "New Word Unlocked!" celebration with sound effects and XP.

### ⛏️ Block Learning  
Mine or place blocks to see their English names. Common blocks like stone, dirt, wood, ores — all labeled automatically.

### 🔍 Auto Quests
Every 5 minutes, a "Find the Animal" quest appears automatically. Find the target animal to earn food rewards and XP. No typing required — perfect for kids who can't read yet.

### 📖 Word Album
Parents can type `/words` to check their child's collection progress. Like a Pokédex but for English words!

### ✨ Designed for Kids
- **Zero typing required** — everything is automatic or proximity-based
- **Bilingual display** — English + Chinese + phonetic symbols
- **Positive reinforcement** — sounds, particles, XP, and item rewards
- **Non-intrusive** — enhances normal gameplay, doesn't interrupt it
- **60-second cooldown** — won't spam the same word repeatedly

---

## 功能介绍

### 🐄 动物邂逅
走到动物旁边，屏幕自动显示英文名、中文名和音标。第一次发现新动物会触发「新单词解锁」特效，伴随音效和经验值奖励。

### ⛏️ 方块学习
挖掘或放置方块时，ActionBar 自动显示英文名称。覆盖石头、泥土、木头、矿石等 30 种常见方块。

### 🔍 自动寻宝
每 5 分钟自动发布一个「找动物」任务，找到目标动物就能获得食物和经验值奖励。不需要打字——完全适合不识字的小朋友。

### 📖 单词图鉴
家长输入 `/words` 可以查看孩子的单词收集进度，像宝可梦图鉴一样！

### ✨ 为儿童设计
- **零打字需求** — 全部自动触发或靠近触发
- **双语显示** — 英文 + 中文 + 音标
- **正向激励** — 音效、粒子特效、经验值、物品奖励
- **不打断游戏** — 增强玩法，不干扰正常游戏体验
- **60 秒冷却** — 同一单词不会重复刷屏

---

## 📊 Vocabulary Coverage | 词汇覆盖

| Category 分类 | Count 数量 | Examples 示例 |
|:---:|:---:|:---|
| 🐾 Animals 动物 | 25 | cow, pig, sheep, chicken, horse, wolf, cat, rabbit, fox, bee, dolphin, panda... |
| 🪨 Blocks 方块 | 30 | stone, dirt, sand, oak log, iron ore, diamond ore, chest, crafting table... |
| **Total 总计** | **55** | |

---

## 🚀 Installation | 安装方法

### For BDS (Dedicated Server) | 服务器安装

1. Download or clone this repository  
   下载或克隆本仓库

2. Copy the `EnglishLearning_BP` folder to your server's `behavior_packs/` directory  
   将 `EnglishLearning_BP` 文件夹复制到服务器的 `behavior_packs/` 目录

3. Add to your world's `world_behavior_packs.json`:  
   在世界的 `world_behavior_packs.json` 中添加：

```json
{
  "pack_id": "a3f1d7e2-8c4b-4f6a-9d2e-1b5c8a3f7e90",
  "version": [1, 0, 0]
}
```

4. Make sure **Beta APIs / Experiments** are enabled in your world  
   确保世界已启用 Beta APIs / 实验功能

5. Restart the server  
   重启服务器

### For Single Player | 单人游戏

1. Copy `EnglishLearning_BP` to:
   - **Windows**: `%localappdata%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\behavior_packs\`
   - **Android**: `/storage/emulated/0/Android/data/com.mojang.minecraftpe/files/games/com.mojang/behavior_packs/`
   - **iOS**: `Minecraft/games/com.mojang/behavior_packs/`

2. Create a new world or edit an existing one, go to **Behavior Packs** and activate "English Learning - 英语启蒙"  
   创建新世界或编辑已有世界，在行为包中激活「English Learning - 英语启蒙」

3. Enable **Beta APIs** in Experiments  
   在实验功能中启用 Beta APIs

---

## 🎮 Usage | 使用方法

| Action 操作 | Result 效果 |
|:---|:---|
| Walk near an animal 走近动物 | English name + Chinese + phonetic displayed 显示英文名+中文+音标 |
| Mine/place a block 挖掘/放置方块 | Block name shown on ActionBar 方块名称显示在操作栏 |
| Wait 5 minutes 等待5分钟 | Auto quest appears 自动寻宝任务出现 |
| Type `/words` 输入 `/words` | View word collection album 查看单词图鉴 |

**Tip for parents 家长提示**: Play together with your child! Point at the screen and read the words out loud. The phonetic symbols are there to help you pronounce correctly even if you're not sure.

**家长提示**：和孩子一起玩！指着屏幕上的单词大声读出来，音标可以帮助你正确发音。

---

## 🏗️ Project Structure | 项目结构

```
EnglishLearning_BP/
├── manifest.json           # Addon manifest
└── scripts/
    ├── main.js             # Entry point, event registration
    ├── vocabulary.js       # Word database (EN/CN/phonetic)
    ├── proximity.js        # Animal proximity detection
    ├── blockLearn.js       # Block break/place learning
    ├── quest.js            # Auto find-the-animal quests
    └── progress.js         # Player progress tracking
```

---

## 🛠️ Technical Details | 技术细节

- **Platform**: Minecraft Bedrock Edition 1.21.60+
- **API**: `@minecraft/server` 2.0.0 (Script API)
- **No resource pack needed** — pure behavior pack with scripts
- **Multiplayer compatible** — each player has independent progress
- **Lightweight** — proximity check runs once per second, minimal performance impact
- **Data persistence** — progress saved via Dynamic Properties (survives server restarts)

---

## 🤝 Contributing | 参与贡献

Contributions are welcome! Here are some ideas:

- 🌍 **Add more languages** — Japanese, Korean, Spanish, French...
- 📚 **Expand vocabulary** — food items, tools, biomes, weather...
- 🎨 **Create a resource pack** — custom textures for a learning-themed UI
- 🔊 **Audio support** — if Bedrock ever supports custom sounds easily
- 📱 **Testing** — test on different platforms (iOS, Android, Windows, Xbox)
- 🐛 **Bug reports** — file issues if something doesn't work

欢迎贡献！以下是一些可以参与的方向：

- 🌍 **多语言支持** — 日语、韩语、西班牙语、法语...
- 📚 **扩充词库** — 食物、工具、生态群系、天气...
- 🎨 **资源包** — 定制学习主题的 UI 材质
- 📱 **测试** — 在不同平台上测试（iOS、Android、Windows、Xbox）
- 🐛 **反馈问题** — 提交 Issue 报告 bug

---

## 📜 License | 许可证

[MIT License](LICENSE) — free to use, modify, and distribute.

MIT 许可证 — 自由使用、修改和分发。

---

## 💡 Inspiration | 灵感来源

This project was inspired by the idea that **the best way to learn is through play**. Minecraft is already one of the most popular games among children worldwide. Instead of adding another "educational app" to the screen time, why not make the game they already love into a learning tool?

这个项目的灵感来自一个简单的理念：**最好的学习方式是在玩中学**。我的世界已经是全世界最受欢迎的儿童游戏之一。与其再增加一个「教育 App」占用屏幕时间，不如把孩子已经喜爱的游戏变成学习工具。

> "小孩为了搞清楚大神的视频在说什么，主动学英语硬啃英文字幕。"  
> — A parent's observation on X/Twitter

---

Made with ❤️ for kids who love Minecraft  
为热爱我的世界的小朋友们用心制作
