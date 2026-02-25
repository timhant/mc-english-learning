// phraseCore.js - Shared phrase display and audio logic
import { system } from "@minecraft/server";
import { getPlayerLevel, getProgress, unlockPhrase } from "./progress.js";
import { isOnCooldown, setCooldown } from "./cooldown.js";
import { CONFIG } from "./config.js";

/**
 * Check if the prerequisite noun has been learned by this player.
 * requiresId: the minecraft ID of the noun, or null (no prereq)
 */
export function hasLearnedNoun(player, requiresId) {
  if (!requiresId) return true;
  const progress = getProgress(player);
  for (let i = 1; i <= 5; i++) {
    const key = "level" + i;
    if (progress.unlocked[key] && progress.unlocked[key].includes(requiresId)) {
      return true;
    }
  }
  return false;
}

/**
 * Get the phrase audio key from the English text.
 * e.g. "Kill a zombie" -> "phrase.kill_a_zombie"
 */
export function getPhraseAudioKey(en) {
  return "phrase." + en.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/_+$/, "");
}

/**
 * Display phrase on ActionBar + play audio.
 * Returns true if displayed, false if blocked.
 */
export function showPhrase(player, phrase, phraseLevel) {
  const playerLevel = getPlayerLevel(player);
  const inLevel = phraseLevel <= playerLevel;

  // Phrase ID for cooldown: use the trigger target ID or event name
  const cooldownId = "phrase:" + (phrase.entity || phrase.block || phrase.item || phrase.event);

  if (isOnCooldown(player.id, cooldownId, true)) return false;
  setCooldown(player.id, cooldownId);

  // Also set cooldown on the noun to prevent noun from firing right after
  const nounId = phrase.requires;
  if (nounId) {
    setCooldown(player.id, nounId);
  }

  try {
    const dim = player.dimension;
    const sel = '@a[name="' + player.name + '"]';
    const pos = player.location;
    const x = pos.x.toFixed(1);
    const y = pos.y.toFixed(1);
    const z = pos.z.toFixed(1);

    // ActionBar display: §a§lEnglish phrase §f中文翻译
    const isNew = inLevel ? unlockPhrase(player, cooldownId, phraseLevel) : false;

    if (isNew) {
      // New phrase: celebration
      dim.runCommand("titleraw " + sel + " times 5 50 10");
      dim.runCommand("titleraw " + sel + " title " + JSON.stringify({ rawtext: [{ text: "" }] }));
      dim.runCommand("titleraw " + sel + " subtitle " + JSON.stringify({
        rawtext: [{ text: "§e✨ §a§l" + phrase.en + " §f" + phrase.cn + " §e✨§r" }]
      }));
      dim.runCommand("playsound random.orb " + sel + " " + x + " " + y + " " + z + " 0.5 1.2");
      dim.runCommand("xp 2 " + sel);
    } else if (inLevel) {
      // Known phrase: normal display
      dim.runCommand("titleraw " + sel + " times 5 40 10");
      dim.runCommand("titleraw " + sel + " title " + JSON.stringify({ rawtext: [{ text: "" }] }));
      dim.runCommand("titleraw " + sel + " subtitle " + JSON.stringify({
        rawtext: [{ text: "§a§l" + phrase.en + " §f" + phrase.cn + "§r" }]
      }));
    } else {
      // Out-of-level: dimmed display
      dim.runCommand("titleraw " + sel + " times 5 40 10");
      dim.runCommand("titleraw " + sel + " title " + JSON.stringify({ rawtext: [{ text: "" }] }));
      dim.runCommand("titleraw " + sel + " subtitle " + JSON.stringify({
        rawtext: [{ text: "§7" + phrase.en + " §8| §7" + phrase.cn + "§r" }]
      }));
    }

    // Play phrase audio (EN then CN)
    if (CONFIG.voiceEnabled) {
      const audioKey = getPhraseAudioKey(phrase.en);
      dim.runCommand("playsound eng." + audioKey + "_en " + sel + " " + x + " " + y + " " + z + " 1 1");
      system.runTimeout(() => {
        try {
          const p = player.location;
          dim.runCommand("playsound eng." + audioKey + "_cn " + sel + " " + p.x.toFixed(1) + " " + p.y.toFixed(1) + " " + p.z.toFixed(1) + " 1 1");
        } catch (e) {}
      }, 40);
    }
  } catch (e) {}

  return true;
}
