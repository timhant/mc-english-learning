import { world, system } from "@minecraft/server";
import { entityMap } from "./vocabulary.js";
import { unlockWord } from "./progress.js";

const cooldowns = new Map();
const COOLDOWN_TICKS = 1200;
const DETECT_RANGE = 5;
const CHECK_INTERVAL = 20;

function showWord(player, word, isNew) {
  try {
    const dim = player.dimension;
    const sel = '@a[name="' + player.name + '"]';
    
    const titleJson = JSON.stringify({ rawtext: [{ text: "§a§l" + word.en + "§r" }] });
    dim.runCommand("titleraw " + sel + " title " + titleJson);

    const subtitleJson = JSON.stringify({ rawtext: [{ text: "§f" + word.cn + "  §7" + word.phonetic + "§r" }] });
    dim.runCommand("titleraw " + sel + " subtitle " + subtitleJson);
    dim.runCommand("titleraw " + sel + " times 10 40 10");

    if (isNew) {
      dim.runCommand("playsound random.levelup " + sel);
      dim.runCommand("xp 3 " + sel);
      const abJson = JSON.stringify({ rawtext: [{ text: "§e✨ New Word Unlocked! ✨§r" }] });
      dim.runCommand("titleraw " + sel + " actionbar " + abJson);
    }
    console.warn("[English Learning] Showed " + word.en + " to " + player.name);
  } catch (e) {
    console.warn("[English Learning] showWord error: " + e);
  }
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
            if (isOnCooldown(player.id, typeId, currentTick)) continue;
            setCooldown(player.id, typeId, currentTick);
            const isNew = unlockWord(player, "entities", typeId);
            showWord(player, word, isNew);
            break;
          } catch (e) { continue; }
        }
      } catch (e) {
        console.warn("[English Learning] player error: " + e);
      }
    }
  }, CHECK_INTERVAL);
}
