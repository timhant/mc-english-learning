// blockLearn.js - Learn words when breaking/placing blocks, with dual-mode trigger
import { world, system } from "@minecraft/server";
import { blockMap } from "./vocab/index.js";
import { breakPhraseMap, placePhraseMap } from "./phraseData.js";
import { hasLearnedNoun, showPhrase } from "./phraseCore.js";
import { unlockWord, getPlayerLevel } from "./progress.js";
import { celebrateLevelUp } from "./levelUp.js";
import { playWordAudio } from "./voice.js";
import { isOnCooldown, setCooldown } from "./cooldown.js";
import { CONFIG } from "./config.js";

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
      dim.runCommand("titleraw " + sel + " times 5 40 10");
      dim.runCommand("titleraw " + sel + " title " + JSON.stringify({ rawtext: [{ text: "" }] }));
      dim.runCommand("titleraw " + sel + " subtitle " + JSON.stringify({ rawtext: [{ text: "§b⛏ " + word.en + "  §f" + word.cn + "  §7" + word.phonetic + "§r" }] }));
    }
  } catch (e) {}
}

function showLightExperience(player, word) {
  try {
    const dim = player.dimension;
    const sel = '@a[name="' + player.name + '"]';
    dim.runCommand("titleraw " + sel + " times 5 40 10");
    dim.runCommand("titleraw " + sel + " title " + JSON.stringify({ rawtext: [{ text: "" }] }));
    dim.runCommand("titleraw " + sel + " subtitle " + JSON.stringify({ rawtext: [{ text: "§7" + word.en + " §8| §7" + word.cn + "§r" }] }));
  } catch (e) {}
}

function handleBlock(player, blockId, actionType) {
  try {
    const word = blockMap.get(blockId);
    if (!word) return;

    const playerLevel = getPlayerLevel(player);
    const inLevel = word.level <= playerLevel;
    const tick = system.currentTick;

    if (!inLevel && !CONFIG.outOfLevelEnabled) return;
    if (isOnCooldown(player.id, blockId, inLevel)) return;

    // v3.0: If noun is already learned, try to show phrase instead
    if (inLevel && hasLearnedNoun(player, blockId)) {
      const phraseMap = actionType === "break" ? breakPhraseMap : placePhraseMap;
      const phraseEntry = phraseMap.get(blockId);
      if (phraseEntry) {
        setCooldown(player.id, blockId);
        showPhrase(player, phraseEntry, phraseEntry.level);
        return;
      }
    }

    // Fall through to noun display
    setCooldown(player.id, blockId);

    const played = playWordAudio(player, blockId);
    if (!played) return;

    if (inLevel) {
      const result = unlockWord(player, "blocks", blockId, word.level);
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

export function startBlockLearning() {
  world.afterEvents.playerBreakBlock.subscribe((event) => {
    handleBlock(event.player, event.brokenBlockPermutation.type.id, "break");
  });
  world.afterEvents.playerPlaceBlock.subscribe((event) => {
    handleBlock(event.player, event.block.typeId, "place");
  });
}
