import { world } from "@minecraft/server";
import { entities, blocks } from "./vocabulary.js";

const PROP_PREFIX = "eng_progress_";

export function getProgress(player) {
  try {
    const raw = world.getDynamicProperty(PROP_PREFIX + player.id);
    if (raw) { try { return JSON.parse(raw); } catch {} }
  } catch (e) {}
  return { entities: [], blocks: [] };
}

function saveProgress(player, progress) {
  try { world.setDynamicProperty(PROP_PREFIX + player.id, JSON.stringify(progress)); } catch (e) {}
}

export function unlockWord(player, category, wordId) {
  const progress = getProgress(player);
  if (!progress[category]) progress[category] = [];
  if (progress[category].includes(wordId)) return false;
  progress[category].push(wordId);
  saveProgress(player, progress);
  return true;
}

export function isUnlocked(player, category, wordId) {
  const progress = getProgress(player);
  return progress[category]?.includes(wordId) ?? false;
}

export function showAlbum(player) {
  try {
    const dim = player.dimension;
    const sel = '@a[name="' + player.name + '"]';
    const progress = getProgress(player);
    const ue = progress.entities || [];
    const ub = progress.blocks || [];
    const total = ue.length + ub.length;
    const max = entities.length + blocks.length;
    function tell(text) { dim.runCommand("tellraw " + sel + " " + JSON.stringify({ rawtext: [{ text: text }] })); }
    tell("§e§l📖 English Album (" + total + "/" + max + ")§r");
    let el = "§b🐾 Animals:§r ";
    for (const e of entities) el += ue.includes(e.id) ? ("§a" + e.en + "✅ ") : "§7??? ";
    tell(el);
    let bl = "§6🪨 Blocks:§r ";
    for (const b of blocks) bl += ub.includes(b.id) ? ("§a" + b.en + "✅ ") : "§7??? ";
    tell(bl);
    tell("§e🏆 Unlocked: " + total + " / " + max + "§r");
  } catch (e) {}
}
