// blockLearn.js - Learn English words when breaking/placing blocks
import { world, system } from "@minecraft/server";
import { blockMap } from "./vocabulary.js";
import { unlockWord } from "./progress.js";

// Cooldown tracking per player per block type
const cooldowns = new Map();
const COOLDOWN_TICKS = 1200; // 60 seconds

function isOnCooldown(playerId, blockId, currentTick) {
  const key = `${playerId}:${blockId}`;
  if (!cooldowns.has(key)) return false;
  return currentTick - cooldowns.get(key) < COOLDOWN_TICKS;
}

function setCooldown(playerId, blockId, currentTick) {
  const key = `${playerId}:${blockId}`;
  cooldowns.set(key, currentTick);
}

/**
 * Show block vocabulary on actionbar
 */
async function showBlockWord(player, word, isNew) {
  try {
    if (isNew) {
      // Big title for new words
      const titleJson = JSON.stringify({
        rawtext: [{ text: `§a§l${word.en}§r` }],
      });
      await player.runCommandAsync(`titleraw @s title ${titleJson}`);

      const subtitleJson = JSON.stringify({
        rawtext: [{ text: `§f${word.cn}  §7${word.phonetic}§r` }],
      });
      await player.runCommandAsync(`titleraw @s subtitle ${subtitleJson}`);
      await player.runCommandAsync("titleraw @s times 10 40 10");
      await player.runCommandAsync("playsound random.levelup @s");
      await player.runCommandAsync("xp 3 @s");

      const abJson = JSON.stringify({
        rawtext: [{ text: "§e✨ 新单词解锁！New Word Unlocked! ✨§r" }],
      });
      await player.runCommandAsync(`titleraw @s actionbar ${abJson}`);
    } else {
      // ActionBar for already-known words (less intrusive)
      const abJson = JSON.stringify({
        rawtext: [
          {
            text: `§b⛏ ${word.en}  §f${word.cn}  §7${word.phonetic}§r`,
          },
        ],
      });
      await player.runCommandAsync(`titleraw @s actionbar ${abJson}`);
    }
  } catch (e) {
    // silently ignore
  }
}

/**
 * Register block learning event handlers
 */
export function startBlockLearning() {
  // Player breaks a block
  world.afterEvents.playerBreakBlock.subscribe((event) => {
    const player = event.player;
    const blockId = event.brokenBlockPermutation.type.id;
    const currentTick = system.currentTick;

    const word = blockMap.get(blockId);
    if (!word) return;
    if (isOnCooldown(player.id, blockId, currentTick)) return;

    setCooldown(player.id, blockId, currentTick);
    const isNew = unlockWord(player, "blocks", blockId);
    showBlockWord(player, word, isNew);
  });

  // Player places a block
  world.afterEvents.playerPlaceBlock.subscribe((event) => {
    const player = event.player;
    const blockId = event.block.typeId;
    const currentTick = system.currentTick;

    const word = blockMap.get(blockId);
    if (!word) return;
    if (isOnCooldown(player.id, blockId, currentTick)) return;

    setCooldown(player.id, blockId, currentTick);
    const isNew = unlockWord(player, "blocks", blockId);
    showBlockWord(player, word, isNew);
  });
}
