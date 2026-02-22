// vocab/index.js - Aggregate all levels and build lookup maps
import { level1 } from "./level1.js";
import { level2 } from "./level2.js";
import { level3 } from "./level3.js";
import { level4 } from "./level4.js";
import { level5 } from "./level5.js";

export const levels = [level1, level2, level3, level4, level5];

// Build entity/block maps: id -> { ...word, level: 1-5 }
export const entityMap = new Map();
export const blockMap = new Map();

for (let i = 0; i < levels.length; i++) {
  const lvl = levels[i];
  const levelNum = i + 1;
  for (const e of lvl.entities) {
    entityMap.set(e.id, { ...e, level: levelNum });
  }
  for (const b of lvl.blocks) {
    blockMap.set(b.id, { ...b, level: levelNum });
  }
}

// Count words per level
export function getWordCount(levelNum) {
  const lvl = levels[levelNum - 1];
  if (!lvl) return 0;
  return lvl.entities.length + lvl.blocks.length;
}

export function getTotalWordCount() {
  let total = 0;
  for (const lvl of levels) {
    total += lvl.entities.length + lvl.blocks.length;
  }
  return total;
}

// Get only entity IDs for a specific level (for quest system)
export function getLevelEntities(levelNum) {
  const lvl = levels[levelNum - 1];
  if (!lvl) return [];
  return lvl.entities;
}

// Reward items for quests
export const rewardItems = [
  "minecraft:apple",
  "minecraft:bread",
  "minecraft:cookie",
  "minecraft:cooked_beef",
  "minecraft:golden_apple",
];
