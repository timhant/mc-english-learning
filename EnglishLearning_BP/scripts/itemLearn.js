// itemLearn.js - Learn words when switching held items
import { world, system } from "@minecraft/server";
import { itemMap } from "./vocab/index.js";
import { foodPhraseMap } from "./phraseData.js";
import { hasLearnedNoun, showPhrase } from "./phraseCore.js";
import { unlockWord, getPlayerLevel } from "./progress.js";
import { celebrateLevelUp } from "./levelUp.js";
import { playWordAudio } from "./voice.js";
import { isOnCooldown, setCooldown } from "./cooldown.js";
import { CONFIG } from "./config.js";

const lastHeldItem = new Map();  // playerId -> itemTypeId
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
        if (isOnCooldown(player.id, currentItemId, inLevel)) continue;

        // v3.0: If noun is already learned, try to show food phrase instead
        if (inLevel && hasLearnedNoun(player, currentItemId)) {
          const phraseEntry = foodPhraseMap.get(currentItemId);
          if (phraseEntry) {
            setCooldown(player.id, currentItemId);
            showPhrase(player, phraseEntry, phraseEntry.level);
            continue;
          }
        }

        // Fall through to noun display
        setCooldown(player.id, currentItemId);

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
