// proximity.js - Entity proximity detection for vocabulary learning
import { world, system } from "@minecraft/server";
import { entityMap } from "./vocabulary.js";
import { unlockWord } from "./progress.js";

// Cooldown tracking: Map<string, Map<string, number>>
// key: playerId, value: Map<entityTypeId, lastShownTick>
const cooldowns = new Map();
const COOLDOWN_TICKS = 1200; // 60 seconds at 20 tps
const DETECT_RANGE = 5;
const CHECK_INTERVAL = 20; // every 1 second

/**
 * Show vocabulary title on player screen
 * @param {Player} player
 * @param {{ en: string, cn: string, phonetic: string }} word
 * @param {boolean} isNew - first time unlocking
 */
async function showWord(player, word, isNew) {
  try {
    // Title: English name in big text
    const titleJson = JSON.stringify({
      rawtext: [{ text: `§a§l${word.en}§r` }],
    });
    await player.runCommandAsync(`titleraw @s title ${titleJson}`);

    // Subtitle: Chinese + phonetic
    const subtitleJson = JSON.stringify({
      rawtext: [{ text: `§f${word.cn}  §7${word.phonetic}§r` }],
    });
    await player.runCommandAsync(`titleraw @s subtitle ${subtitleJson}`);

    // Set display duration
    await player.runCommandAsync("titleraw @s times 10 40 10");

    if (isNew) {
      // New word unlock effects
      await player.runCommandAsync("playsound random.levelup @s");
      await player.runCommandAsync("xp 3 @s");
      const abJson = JSON.stringify({
        rawtext: [{ text: "§e✨ 新单词解锁！New Word Unlocked! ✨§r" }],
      });
      await player.runCommandAsync(`titleraw @s actionbar ${abJson}`);
    }
  } catch (e) {
    // silently ignore command errors
  }
}

/**
 * Check cooldown for a player + entity type combo
 */
function isOnCooldown(playerId, entityTypeId, currentTick) {
  if (!cooldowns.has(playerId)) return false;
  const playerCooldowns = cooldowns.get(playerId);
  if (!playerCooldowns.has(entityTypeId)) return false;
  return currentTick - playerCooldowns.get(entityTypeId) < COOLDOWN_TICKS;
}

function setCooldown(playerId, entityTypeId, currentTick) {
  if (!cooldowns.has(playerId)) {
    cooldowns.set(playerId, new Map());
  }
  cooldowns.get(playerId).set(entityTypeId, currentTick);
}

/**
 * Start the proximity detection loop
 */
export function startProximityDetection() {
  system.runInterval(() => {
    const currentTick = system.currentTick;
    const players = world.getAllPlayers();

    for (const player of players) {
      try {
        // Get nearby entities
        const nearby = player.dimension.getEntities({
          location: player.location,
          maxDistance: DETECT_RANGE,
          excludeTypes: ["minecraft:player", "minecraft:item"],
        });

        for (const entity of nearby) {
          const typeId = entity.typeId;
          const word = entityMap.get(typeId);

          if (!word) continue; // not in vocabulary
          if (isOnCooldown(player.id, typeId, currentTick)) continue;

          // Set cooldown
          setCooldown(player.id, typeId, currentTick);

          // Check if new word
          const isNew = unlockWord(player, "entities", typeId);

          // Show the word
          showWord(player, word, isNew);
          break; // only show one word per tick per player
        }
      } catch (e) {
        // silently ignore per-player errors
      }
    }
  }, CHECK_INTERVAL);
}
