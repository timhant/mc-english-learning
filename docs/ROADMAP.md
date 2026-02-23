# MC English Learning — Product Roadmap
*Created: 2026-02-23*

## Vision | 愿景
让我的世界成为孩子从 5 岁到 12 岁持续学习英语的伙伴。不是教育软件，是让游戏本身变成学习工具。

## Three-Phase Growth Path | 三阶段成长路径

### Phase 1: Noun Recognition 名词认知（Age 5-8）
- **Trigger**: Proximity to entities, break/place blocks
- **Content**: Nouns — animal names, block names, item names
- **Target**: 400-500 words
- **Learning**: See → Hear → Remember
- **Status**: v2.x (current focus)

### Phase 2: Phrase Composition 短语组合（Age 8-10）
- **Trigger**: Player actions (kill, craft, feed, trade, weather events)
- **Content**: Verbs + adjectives + phrases
- **Examples**:
  - Mine iron ore → "Mine iron ore" / "挖掘铁矿石"
  - Kill zombie → "Kill a zombie" / "击杀僵尸"
  - Feed cow → "Feed the cow" / "喂奶牛"
  - Raining → "It's raining" / "下雨了"
  - On fire → "You're on fire!" / "你着火了！"
- **Target**: +300-400 phrases on top of Phase 1 nouns
- **Learning**: Do action → Hear sentence → Understand context
- **Status**: v3.0 (planned)

### Phase 3: Situational Dialogue 情景对话（Age 10-12）
- **Trigger**: Village trading, achievements, game events
- **Content**: Full sentences, dialogues, daily expressions
- **Examples**:
  - Trading → "I'd like to buy 3 emeralds, please."
  - Low health → "I need to eat something."
  - Found diamond → "Wow, I found diamonds! I'm so lucky!"
  - Death → "Never give up. Try again!"
- **Target**: +200-300 sentences
- **Learning**: Game situation → Hear practical sentence → Internalize
- **Status**: Long-term (v4.0+)

## Age-Based Difficulty | 年龄匹配

Future implementation via config or command:
```json
{ "childAge": 6 }   // → Phase 1 only
{ "childAge": 9 }   // → Phase 1 + 2
{ "childAge": 11 }  // → All phases
```

Or command: `/english-level beginner|intermediate|advanced`

## Architecture Principles | 架构原则

1. **Vocab entry `type` field**: `"noun"` / `"phrase"` / `"sentence"` — pre-reserved for future phases
2. **Voice system is generic**: works for short words and long sentences equally
3. **Trigger system is extensible**: add `onKill`, `onCraft`, `onWeatherChange` listeners for Phase 2
4. **Single addon, multiple modes**: no need for separate addons per phase

## Key Design Decisions | 关键设计决策

### Level Unlocking (v2.x)
- **Leveled words**: Full experience (title + voice + celebration + XP + progress tracking)
- **Out-of-level words**: Still triggerable with lightweight experience (ActionBar + voice only, no celebration, no progress)
- **Rationale**: Don't punish curiosity; control cognitive load; create "reunion surprise" when formally unlocked; natural spaced repetition

### Cognitive Load Management
- Based on Cognitive Load Theory — 5-8 year olds can process ~3-4 new concepts at a time
- Full unlock would cause "noise fatigue" where children ignore all prompts
- Leveled + lightweight out-of-level = balanced exposure

### Level Organization (v2.x)
- Organized by **gameplay progression**, not by theme
- Each level mixes animals + blocks + mobs + items that naturally appear at that game stage
- Lv1 includes zombies/skeletons (first night encounters), not locked behind Lv4
