// itemLearn.js - Learn words when switching held items
import { world, system } from "@minecraft/server";
import { itemMap } from "./vocab/index.js";
import { unlockWord, getPlayerLevel } from "./progress.js";
import { celebrateLevelUp } from "./levelUp.js";
import { playWordAudio } from "./voice.js";
import { COOLDOWN_TICKS, OUT_OF_LEVEL_COOLDOWN_TICKS } from "./config.js";
import { CONFIG } from "./config.js";

const lastHeldItem = new Map();  // playerId -> itemTypeId
const cooldowns = new Map();
const CHECK_INTERVAL = 20; // every 1 second

function isOnCooldown(pid, itemId, tick, inLevel) {
  const k = pid + ":" + itemId;
  if (!cooldowns.has(k)) return false;
  const limit = inLevel ? COOLDOWN_TICKS : OUT_OF_LEVEL_COOLDOWN_TICKS;
  return tick - cooldowns.get(k) < limit;
}

function setCooldown(pid, itemId, tick) {
  cooldowns.set(pid + ":" + itemId, tick);
}

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
      dim.runCommand("titleraw " + sel + " actionbar " + JSON.stringify({ rawtext: [{ text: "§d🎒 " + word.en + "  §f" + word.cn + "  §7" + word.phonetic + "§r" }] }));
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

export function startItemLearning() {
  system.runInterval(() => {
    const tick = system.currentTick;
    let players;
    try { players = world.getAllPlayers(); } catch (e) { return; }

    for (const player of players) {
      try {
        const inventory = player.getComponent("minecraft:inventory");
        if (!inventory) continue;
        const container = inventory.container;
        if (!container) continue;

        const slot = container.getItem(player.selectedSlotIndex);
        const currentItemId = slot ? slot.typeId : null;
        const lastId = lastHeldItem.get(player.id);

        if (currentItemId === lastId) continue;
        lastHeldItem.set(player.id, currentItemId);

        if (!currentItemId) continue;

        const word = itemMap.get(currentItemId);
        if (!word) continue;

        const playerLevel = getPlayerLevel(player);
        const inLevel = word.level <= playerLevel;

        if (!inLevel && !CONFIG.outOfLevelEnabled) continue;
        if (isOnCooldown(player.id, currentItemId, tick, inLevel)) continue;
        setCooldown(player.id, currentItemId, tick);

        const played = playWordAudio(player, currentItemId);
        if (!played) continue;

        if (inLevel) {
          const result = unlockWord(player, "items", currentItemId, word.level);
          showFullExperience(player, word, result.isNew);

          if (result.leveledUp) {
            system.runTimeout(() => {
              celebrateLevelUp(player, result.newLevel);
            }, 40);
          }
        } else {
          showLightExperience(player, word);
        }
      } catch (e) {}
    }
  }, CHECK_INTERVAL);
}
