// proximity.js - Entity proximity detection with dual-mode trigger
import { world, system } from "@minecraft/server";
import { entityMap } from "./vocab/index.js";
import { unlockWord, getPlayerLevel } from "./progress.js";
import { celebrateLevelUp } from "./levelUp.js";
import { playWordAudio } from "./voice.js";
import { DETECT_RANGE } from "./config.js";
import { CONFIG } from "./config.js";
import { isOnCooldown, setCooldown } from "./cooldown.js";

const CHECK_INTERVAL = 20; // every 1 second

function showFullExperience(player, word, isNew) {
  try {
    const dim = player.dimension;
    const sel = '@a[name="' + player.name + '"]';

    if (isNew) {
      dim.runCommand("titleraw " + sel + " times 10 40 10");
      dim.runCommand("titleraw " + sel + " title " + JSON.stringify({ rawtext: [{ text: "§a§l" + word.en + "§r" }] }));
      dim.runCommand("titleraw " + sel + " subtitle " + JSON.stringify({ rawtext: [{ text: "§f" + word.cn + "  §7" + word.phonetic + "§r" }] }));
      dim.runCommand("playsound random.levelup " + sel);
      dim.runCommand("xp 3 " + sel);
      dim.runCommand("titleraw " + sel + " actionbar " + JSON.stringify({ rawtext: [{ text: "§e✨ New Word Unlocked! ✨§r" }] }));
    } else {
      dim.runCommand("titleraw " + sel + " actionbar " + JSON.stringify({ rawtext: [{ text: "§a" + word.en + "  §f" + word.cn + "  §7" + word.phonetic + "§r" }] }));
    }
  } catch (e) {}
}

function showLightExperience(player, word) {
  try {
    const dim = player.dimension;
    const sel = '@a[name="' + player.name + '"]';
    dim.runCommand("titleraw " + sel + " actionbar " + JSON.stringify({ rawtext: [{ text: "§7" + word.en + " §8| §7" + word.cn + "§r" }] }));
  } catch (e) {}
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

            const inLevel = word.level <= playerLevel;

            if (inLevel) {
              if (isOnCooldown(player.id, typeId, true)) continue;
              setCooldown(player.id, typeId);

              // Try to play audio; if locked, skip visual too
              const played = playWordAudio(player, typeId);
              if (!played) continue;

              const result = unlockWord(player, "entities", typeId, word.level);
              showFullExperience(player, word, result.isNew);

              if (result.leveledUp) {
                system.runTimeout(() => {
                  celebrateLevelUp(player, result.newLevel);
                }, 40);
              }
            } else if (CONFIG.outOfLevelEnabled) {
              if (isOnCooldown(player.id, typeId, false)) continue;
              setCooldown(player.id, typeId);

              const played = playWordAudio(player, typeId);
              if (!played) continue;

              showLightExperience(player, word);
            }

            break; // one word per tick per player
          } catch (e) { continue; }
        }
      } catch (e) {}
    }
  }, CHECK_INTERVAL);
}
