// progress.js - Player progress tracking (word collection album)
import { world } from "@minecraft/server";
import { entities, blocks } from "./vocabulary.js";

const PROP_PREFIX = "eng_progress_";

/**
 * Get player's unlocked words progress
 * @param {Player} player
 * @returns {{ entities: string[], blocks: string[] }}
 */
export function getProgress(player) {
  const key = PROP_PREFIX + player.id;
  const raw = world.getDynamicProperty(key);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // corrupted data, reset
    }
  }
  return { entities: [], blocks: [] };
}

/**
 * Save player progress
 * @param {Player} player
 * @param {{ entities: string[], blocks: string[] }} progress
 */
function saveProgress(player, progress) {
  const key = PROP_PREFIX + player.id;
  world.setDynamicProperty(key, JSON.stringify(progress));
}

/**
 * Unlock a new word for a player
 * @param {Player} player
 * @param {"entities"|"blocks"} category
 * @param {string} wordId - e.g. "minecraft:cow"
 * @returns {boolean} true if this is a NEW unlock
 */
export function unlockWord(player, category, wordId) {
  const progress = getProgress(player);
  if (!progress[category]) {
    progress[category] = [];
  }
  if (progress[category].includes(wordId)) {
    return false; // already unlocked
  }
  progress[category].push(wordId);
  saveProgress(player, progress);
  return true;
}

/**
 * Check if a word is already unlocked
 * @param {Player} player
 * @param {"entities"|"blocks"} category
 * @param {string} wordId
 * @returns {boolean}
 */
export function isUnlocked(player, category, wordId) {
  const progress = getProgress(player);
  return progress[category]?.includes(wordId) ?? false;
}

/**
 * Display word album to player via chat
 * @param {Player} player
 */
export function showAlbum(player) {
  const progress = getProgress(player);
  const unlockedEntities = progress.entities || [];
  const unlockedBlocks = progress.blocks || [];
  const total = unlockedEntities.length + unlockedBlocks.length;
  const max = entities.length + blocks.length;

  player.sendMessage(`§e§l📖 英语图鉴 English Album (${total}/${max})§r`);
  player.sendMessage("§a─────────────────────────§r");

  // Entities section
  let entityLine = "§b🐾 动物 Animals:§r ";
  for (const e of entities) {
    if (unlockedEntities.includes(e.id)) {
      entityLine += `§a${e.en}✅§r `;
    } else {
      entityLine += `§7???❌§r `;
    }
  }
  player.sendMessage(entityLine);

  // Blocks section
  let blockLine = "§6🪨 方块 Blocks:§r ";
  for (const b of blocks) {
    if (unlockedBlocks.includes(b.id)) {
      blockLine += `§a${b.en}✅§r `;
    } else {
      blockLine += `§7???❌§r `;
    }
  }
  player.sendMessage(blockLine);

  player.sendMessage("§a─────────────────────────§r");
  player.sendMessage(`§e🏆 已解锁 Unlocked: ${total} / ${max}§r`);
}
