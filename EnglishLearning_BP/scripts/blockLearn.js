import { world, system } from "@minecraft/server";
import { blockMap } from "./vocabulary.js";
import { unlockWord } from "./progress.js";

const cooldowns = new Map();
const COOLDOWN_TICKS = 1200;

function isOnCooldown(pid, bid, tick) {
  const k = pid + ":" + bid;
  if (!cooldowns.has(k)) return false;
  return tick - cooldowns.get(k) < COOLDOWN_TICKS;
}
function setCooldown(pid, bid, tick) { cooldowns.set(pid + ":" + bid, tick); }

function showBlockWord(player, word, isNew) {
  try {
    const dim = player.dimension;
    const sel = '@a[name="' + player.name + '"]';
    if (isNew) {
      dim.runCommand("titleraw " + sel + " title " + JSON.stringify({ rawtext: [{ text: "§a§l" + word.en + "§r" }] }));
      dim.runCommand("titleraw " + sel + " subtitle " + JSON.stringify({ rawtext: [{ text: "§f" + word.cn + "  §7" + word.phonetic + "§r" }] }));
      dim.runCommand("titleraw " + sel + " times 10 40 10");
      dim.runCommand("playsound random.levelup " + sel);
      dim.runCommand("xp 3 " + sel);
      dim.runCommand("titleraw " + sel + " actionbar " + JSON.stringify({ rawtext: [{ text: "§e✨ New Word Unlocked! ✨§r" }] }));
    } else {
      dim.runCommand("titleraw " + sel + " actionbar " + JSON.stringify({ rawtext: [{ text: "§b⛏ " + word.en + "  §f" + word.cn + "  §7" + word.phonetic + "§r" }] }));
    }
  } catch (e) {}
}

export function startBlockLearning() {
  world.afterEvents.playerBreakBlock.subscribe((event) => {
    const p = event.player, bid = event.brokenBlockPermutation.type.id, tick = system.currentTick;
    const w = blockMap.get(bid);
    if (!w || isOnCooldown(p.id, bid, tick)) return;
    setCooldown(p.id, bid, tick);
    showBlockWord(p, w, unlockWord(p, "blocks", bid));
  });
  world.afterEvents.playerPlaceBlock.subscribe((event) => {
    const p = event.player, bid = event.block.typeId, tick = system.currentTick;
    const w = blockMap.get(bid);
    if (!w || isOnCooldown(p.id, bid, tick)) return;
    setCooldown(p.id, bid, tick);
    showBlockWord(p, w, unlockWord(p, "blocks", bid));
  });
}
