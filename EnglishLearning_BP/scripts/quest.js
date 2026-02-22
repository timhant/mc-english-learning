import { world, system } from "@minecraft/server";
import { entities, rewardItems } from "./vocabulary.js";

const activeQuests = new Map();
const QUEST_INTERVAL = 6000;
const QUEST_TIMEOUT = 6000;
const CHECK_INTERVAL = 20;

function pick() { return entities[Math.floor(Math.random() * entities.length)]; }

function startQuest(p) {
  const t = pick();
  activeQuests.set(p.id, { targetId: t.id, targetEn: t.en, targetCn: t.cn, startTick: system.currentTick });
  try {
    const dim = p.dimension, sel = '@a[name="' + p.name + '"]';
    dim.runCommand("titleraw " + sel + " title " + JSON.stringify({ rawtext: [{ text: "§d§l🔍 FIND: " + t.en + "§r" }] }));
    dim.runCommand("titleraw " + sel + " subtitle " + JSON.stringify({ rawtext: [{ text: "§f找到: " + t.cn + "!§r" }] }));
    dim.runCommand("titleraw " + sel + " times 10 60 10");
    dim.runCommand("playsound note.pling " + sel);
  } catch (e) {}
}

function complete(p, q) {
  activeQuests.delete(p.id);
  try {
    const dim = p.dimension, sel = '@a[name="' + p.name + '"]';
    dim.runCommand("titleraw " + sel + " title " + JSON.stringify({ rawtext: [{ text: "§a§l✅ " + q.targetEn + "!§r" }] }));
    dim.runCommand("titleraw " + sel + " subtitle " + JSON.stringify({ rawtext: [{ text: "§aGreat job! §e⭐§r" }] }));
    dim.runCommand("titleraw " + sel + " times 10 40 10");
    dim.runCommand("playsound random.toast " + sel);
    dim.runCommand("xp 5 " + sel);
    const rw = rewardItems[Math.floor(Math.random() * rewardItems.length)];
    dim.runCommand("give " + sel + " " + rw + " " + (Math.floor(Math.random() * 3) + 1));
  } catch (e) {}
}

function cancel(p) {
  const q = activeQuests.get(p.id);
  activeQuests.delete(p.id);
  if (!q) return;
  try {
    const sel = '@a[name="' + p.name + '"]';
    p.dimension.runCommand("titleraw " + sel + " actionbar " + JSON.stringify({ rawtext: [{ text: "§7⏰ Time's up! " + q.targetEn + "§r" }] }));
  } catch (e) {}
}

export function startQuestSystem() {
  system.runInterval(() => {
    const ct = system.currentTick;
    let ps; try { ps = world.getAllPlayers(); } catch (e) { return; }
    for (const p of ps) { try { const q = activeQuests.get(p.id); if (!q) startQuest(p); else if (ct - q.startTick > QUEST_TIMEOUT) cancel(p); } catch (e) {} }
  }, QUEST_INTERVAL);
  system.runInterval(() => {
    let ps; try { ps = world.getAllPlayers(); } catch (e) { return; }
    for (const p of ps) { try { const q = activeQuests.get(p.id); if (!q) continue; if (p.dimension.getEntities({ location: p.location, maxDistance: 3, type: q.targetId }).length > 0) complete(p, q); } catch (e) {} }
  }, CHECK_INTERVAL);
  system.runInterval(() => {
    const ct = system.currentTick;
    let ps; try { ps = world.getAllPlayers(); } catch (e) { return; }
    for (const p of ps) { try { const q = activeQuests.get(p.id); if (q && ct - q.startTick > QUEST_TIMEOUT) { cancel(p); system.runTimeout(() => { if (!activeQuests.has(p.id)) startQuest(p); }, 60); } } catch (e) {} }
  }, 200);
}
