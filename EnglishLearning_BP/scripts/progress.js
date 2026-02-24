// progress.js - Player progress tracking with level system (v2.5: entities + blocks + items)
import { world } from "@minecraft/server";
import { levels, getWordCount, getTotalWordCount } from "./vocab/index.js";
import { CONFIG } from "./config.js";

const PROP_PREFIX = "eng_v2_";

function defaultProgress() {
  return {
    level: 1,
    unlocked: { level1: [], level2: [], level3: [], level4: [], level5: [] },
    phrases: { level1: [], level2: [], level3: [], level4: [], level5: [] },
    totalWords: 0,
    totalPhrases: 0,
    questsCompleted: 0,
  };
}

export function getProgress(player) {
  try {
    const raw = world.getDynamicProperty(PROP_PREFIX + player.id);
    if (raw) {
      try {
        const p = JSON.parse(raw);
        if (!p.level) p.level = 1;
        if (!p.unlocked) p.unlocked = {};
        if (!p.phrases) p.phrases = {};
        for (let i = 1; i <= 5; i++) {
          if (!p.unlocked["level" + i]) p.unlocked["level" + i] = [];
          if (!p.phrases["level" + i]) p.phrases["level" + i] = [];
        }
        if (!p.totalWords) p.totalWords = 0;
        if (!p.totalPhrases) p.totalPhrases = 0;
        if (!p.questsCompleted) p.questsCompleted = 0;
        return p;
      } catch {}
    }
  } catch (e) {}
  return defaultProgress();
}

function saveProgress(player, progress) {
  try {
    world.setDynamicProperty(PROP_PREFIX + player.id, JSON.stringify(progress));
  } catch (e) {}
}

/**
 * Unlock a word. Returns { isNew, leveledUp, newLevel }
 * category: "entities" | "blocks" | "items" (for display only, all stored per level)
 */
export function unlockWord(player, category, wordId, wordLevel) {
  const progress = getProgress(player);
  const key = "level" + wordLevel;

  if (!progress.unlocked[key]) progress.unlocked[key] = [];
  if (progress.unlocked[key].includes(wordId)) {
    return { isNew: false, leveledUp: false, newLevel: progress.level };
  }

  progress.unlocked[key].push(wordId);
  progress.totalWords++;

  // Check level up
  let leveledUp = false;
  let newLevel = progress.level;

  if (progress.level < CONFIG.maxLevel) {
    const currentLevelKey = "level" + progress.level;
    const currentUnlocked = progress.unlocked[currentLevelKey].length;
    const currentTotal = getWordCount(progress.level);

    if (currentTotal > 0 && currentUnlocked / currentTotal >= CONFIG.unlockThreshold) {
      progress.level++;
      newLevel = progress.level;
      leveledUp = true;
    }
  }

  saveProgress(player, progress);
  return { isNew: true, leveledUp, newLevel };
}

export function getPlayerLevel(player) {
  return getProgress(player).level;
}

/**
 * Unlock a phrase. Returns true if it was new.
 * phraseId: "phrase:minecraft:zombie" etc.
 */
export function unlockPhrase(player, phraseId, phraseLevel) {
  const progress = getProgress(player);
  const key = "level" + phraseLevel;

  if (!progress.phrases[key]) progress.phrases[key] = [];
  if (progress.phrases[key].includes(phraseId)) {
    return false;
  }

  progress.phrases[key].push(phraseId);
  progress.totalPhrases++;
  saveProgress(player, progress);
  return true;
}

export function incrementQuests(player) {
  const progress = getProgress(player);
  progress.questsCompleted++;
  saveProgress(player, progress);
}

export function showAlbum(player) {
  try {
    const dim = player.dimension;
    const sel = '@a[name="' + player.name + '"]';
    const progress = getProgress(player);
    const total = progress.totalWords;
    const max = getTotalWordCount();

    function tell(text) {
      dim.runCommand("tellraw " + sel + " " + JSON.stringify({ rawtext: [{ text: text }] }));
    }

    tell("§e§l📖 English Album (" + total + "/" + max + ") §d Lv." + progress.level + "§r");
    tell("§a───────────────────────§r");

    for (let i = 0; i < levels.length; i++) {
      const lvl = levels[i];
      const num = i + 1;
      const key = "level" + num;
      const unlocked = progress.unlocked[key] || [];
      const wordCount = lvl.entities.length + lvl.blocks.length + (lvl.items ? lvl.items.length : 0);
      const locked = num > progress.level;

      if (locked) {
        tell("§7" + lvl.star + " " + lvl.nameCn + " " + lvl.name + " 🔒§r");
      } else {
        tell("§b" + lvl.star + " " + lvl.nameCn + " " + lvl.name + " (" + unlocked.length + "/" + wordCount + ")§r");
        let line = "";
        const allWords = lvl.entities.concat(lvl.blocks).concat(lvl.items || []);
        for (const w of allWords) {
          line += unlocked.includes(w.id) ? ("§a" + w.en + "✅ ") : "§7??? ";
        }
        tell(line + "§r");
      }
    }

    tell("§a───────────────────────§r");
    tell("§e🏆 Total: " + total + " / " + max + " | Quests: " + progress.questsCompleted + "§r");
  } catch (e) {}
}
