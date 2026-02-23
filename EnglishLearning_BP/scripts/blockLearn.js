// blockLearn.js - Learn words when breaking/placing blocks, with dual-mode trigger
import { world, system } from "@minecraft/server";
import { blockMap } from "./vocab/index.js";
import { unlockWord, getPlayerLevel } from "./progress.js";
import { celebrateLevelUp } from "./levelUp.js";
import { playWordAudio } from "./voice.js";
import { COOLDOWN_TICKS, OUT_OF_LEVEL_COOLDOWN_TICKS } from "./config.js";
import { CONFIG } from "./config.js";

const cooldowns = new Map();

function getCooldownLimit(inLevel) {
  return inLevel ? COOLDOWN_TICKS : OUT_OF_LEVEL_COOLDOWN_TICKS;
}

function isOnCooldown(pid, bid, tick, inLevel) {
  const k = pid + ":" + bid;
  if (!cooldowns.has(k)) return false;
  return tick - cooldowns.get(k) < getCooldownLimit(inLevel);
}

function setCooldown(pid, bid, tick) {
  cooldowns.set(pid + ":" + bid, tick);
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
      dim.runCommand("titleraw " + sel + " actionbar " + JSON.stringify({ rawtext: [{ text: "§b⛏ " + word.en + "  §f" + word.cn + "  §7" + word.phonetic + "§r" }] }));
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

function handleBlock(player, blockId) {
  try {
    const word = blockMap.get(blockId);
    if (!word) return;

    const playerLevel = getPlayerLevel(player);
    const inLevel = word.level <= playerLevel;
    const tick = system.currentTick;

    if (!inLevel && !CONFIG.outOfLevelEnabled) return;
    if (isOnCooldown(player.id, blockId, tick, inLevel)) return;
    setCooldown(player.id, blockId, tick);

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
    handleBlock(event.player, event.brokenBlockPermutation.type.id);
  });
  world.afterEvents.playerPlaceBlock.subscribe((event) => {
    handleBlock(event.player, event.block.typeId);
  });
}
