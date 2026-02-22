// proximity.js - Entity proximity detection with level gating
import { world, system } from "@minecraft/server";
import { entityMap } from "./vocab/index.js";
import { unlockWord, getPlayerLevel } from "./progress.js";
import { celebrateLevelUp } from "./levelUp.js";
import { COOLDOWN_TICKS, DETECT_RANGE } from "./config.js";

const cooldowns = new Map();
const CHECK_INTERVAL = 20; // every 1 second

function showWord(player, word, isNew) {
  try {
    const dim = player.dimension;
    const sel = '@a[name="' + player.name + '"]';

    dim.runCommand("titleraw " + sel + " times 10 40 10");

    const titleJson = JSON.stringify({ rawtext: [{ text: "§a§l" + word.en + "§r" }] });
    dim.runCommand("titleraw " + sel + " title " + titleJson);

    const subtitleJson = JSON.stringify({ rawtext: [{ text: "§f" + word.cn + "  §7" + word.phonetic + "§r" }] });
    dim.runCommand("titleraw " + sel + " subtitle " + subtitleJson);

    if (isNew) {
      dim.runCommand("playsound random.levelup " + sel);
      dim.runCommand("xp 3 " + sel);
      const abJson = JSON.stringify({ rawtext: [{ text: "§e✨ New Word Unlocked! ✨§r" }] });
      dim.runCommand("titleraw " + sel + " actionbar " + abJson);
    }
  } catch (e) {}
}

function isOnCooldown(playerId, entityTypeId, currentTick) {
  if (!cooldowns.has(playerId)) return false;
  const pc = cooldowns.get(playerId);
  if (!pc.has(entityTypeId)) return false;
  return currentTick - pc.get(entityTypeId) < COOLDOWN_TICKS;
}

function setCooldown(playerId, entityTypeId, currentTick) {
  if (!cooldowns.has(playerId)) cooldowns.set(playerId, new Map());
  cooldowns.get(playerId).set(entityTypeId, currentTick);
}

export function startProximityDetection() {
  system.runInterval(() => {
    const currentTick = system.currentTick;
    let players;
    try { players = world.getAllPlayers(); } catch (e) { return; }
    if (players.length === 0) return;

    for (const player of players) {
      try {
        const playerLevel = getPlayerLevel(player);
        const nearby = player.dimension.getEntities({
          location: player.location,
          maxDistance: DETECT_RANGE,
          excludeTypes: ["minecraft:player", "minecraft:item"],
        });

        for (const entity of nearby) {
          try {
            const typeId = entity.typeId;
            const word = entityMap.get(typeId);
            if (!word) continue;
            if (word.level > playerLevel) continue; // level gated
            if (isOnCooldown(player.id, typeId, currentTick)) continue;

            setCooldown(player.id, typeId, currentTick);
            const result = unlockWord(player, "entities", typeId, word.level);
            showWord(player, word, result.isNew);

            if (result.leveledUp) {
              system.runTimeout(() => {
                celebrateLevelUp(player, result.newLevel);
              }, 40);
            }
            break; // one word per tick per player
          } catch (e) { continue; }
        }
      } catch (e) {}
    }
  }, CHECK_INTERVAL);
}
