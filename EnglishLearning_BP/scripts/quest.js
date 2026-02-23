// quest.js - Entity-finding & block-digging/placing quests, level-aware (v2.6)
import { world, system } from "@minecraft/server";
import { getLevelEntities, getLevelBlocks, rewardItems } from "./vocab/index.js";
import { getPlayerLevel, incrementQuests } from "./progress.js";
import { QUEST_INTERVAL, QUEST_TIMEOUT } from "./config.js";

const activeQuests = new Map();
const CHECK_INTERVAL = 20;

// quest types
const TYPE_ENTITY = "entity";
const TYPE_BLOCK  = "block";

function pickTarget(playerLevel) {
  const entities = getLevelEntities(playerLevel);
  const blocks   = getLevelBlocks(playerLevel);

  const hasEntities = entities.length > 0;
  const hasBlocks   = blocks.length > 0;

  if (!hasEntities && !hasBlocks) return null;

  // 50/50 mix; fall back to whichever pool exists
  let useBlocks = hasBlocks && (!hasEntities || Math.random() < 0.5);

  if (useBlocks) {
    const t = blocks[Math.floor(Math.random() * blocks.length)];
    return { ...t, questType: TYPE_BLOCK };
  } else {
    const t = entities[Math.floor(Math.random() * entities.length)];
    return { ...t, questType: TYPE_ENTITY };
  }
}

function startQuest(p) {
  try {
    const level = getPlayerLevel(p);
    const t = pickTarget(level);
    if (!t) {
      console.warn("[Quest] No targets available for player", p.name, "level", level);
      return;
    }

    activeQuests.set(p.id, {
      targetId:  t.id,
      targetEn:  t.en,
      targetCn:  t.cn,
      questType: t.questType,
      startTick: system.currentTick,
    });

    const dim = p.dimension;
    const sel = '@a[name="' + p.name + '"]';
    dim.runCommand("titleraw " + sel + " times 10 60 10");

    if (t.questType === TYPE_BLOCK) {
      dim.runCommand("titleraw " + sel + " title "    + JSON.stringify({ rawtext: [{ text: "§d§l⛏ DIG: " + t.en + "§r" }] }));
      dim.runCommand("titleraw " + sel + " subtitle " + JSON.stringify({ rawtext: [{ text: "§f挖掘/放置: " + t.cn + "!§r" }] }));
    } else {
      dim.runCommand("titleraw " + sel + " title "    + JSON.stringify({ rawtext: [{ text: "§d§l🔍 FIND: " + t.en + "§r" }] }));
      dim.runCommand("titleraw " + sel + " subtitle " + JSON.stringify({ rawtext: [{ text: "§f找到: " + t.cn + "!§r" }] }));
    }

    dim.runCommand("playsound note.pling " + sel);
    console.warn("[Quest]", p.name, "→", t.questType, t.id, "(level " + level + ")");
  } catch (e) {
    console.warn("[Quest] startQuest error:", e);
  }
}

function complete(p, q) {
  activeQuests.delete(p.id);
  try {
    incrementQuests(p);
    const dim = p.dimension;
    const sel = '@a[name="' + p.name + '"]';
    dim.runCommand("titleraw " + sel + " times 10 40 10");
    dim.runCommand("titleraw " + sel + " title "    + JSON.stringify({ rawtext: [{ text: "§a§l✅ " + q.targetEn + "!§r" }] }));
    dim.runCommand("titleraw " + sel + " subtitle " + JSON.stringify({ rawtext: [{ text: "§a太棒了! Great job! §e⭐§r" }] }));
    dim.runCommand("playsound random.toast " + sel);
    dim.runCommand("xp 5 " + sel);
    const rw = rewardItems[Math.floor(Math.random() * rewardItems.length)];
    dim.runCommand("give " + sel + " " + rw + " " + (Math.floor(Math.random() * 3) + 1));
    dim.runCommand("particle minecraft:totem_particle ~ ~1 ~");
    console.warn("[Quest]", p.name, "completed", q.targetId);
  } catch (e) {
    console.warn("[Quest] complete error:", e);
  }
}

function cancel(p) {
  const q = activeQuests.get(p.id);
  activeQuests.delete(p.id);
  if (!q) return;
  try {
    const sel = '@a[name="' + p.name + '"]';
    p.dimension.runCommand("titleraw " + sel + " actionbar " + JSON.stringify({ rawtext: [{ text: "§7⏰ Time's up! " + q.targetEn + "§r" }] }));
    console.warn("[Quest]", p.name, "timed out on", q.targetId);
  } catch (e) {
    console.warn("[Quest] cancel error:", e);
  }
}

export function startQuestSystem() {
  // ── Assign quests & timeout check ────────────────────────────────────────
  system.runInterval(() => {
    const ct = system.currentTick;
    let ps;
    try { ps = world.getAllPlayers(); } catch (e) { return; }
    for (const p of ps) {
      try {
        const q = activeQuests.get(p.id);
        if (!q) {
          startQuest(p);
        } else if (ct - q.startTick > QUEST_TIMEOUT) {
          cancel(p);
        }
      } catch (e) {
        console.warn("[Quest] interval error:", e);
      }
    }
  }, QUEST_INTERVAL);

  // ── Entity proximity check ────────────────────────────────────────────────
  system.runInterval(() => {
    let ps;
    try { ps = world.getAllPlayers(); } catch (e) { return; }
    for (const p of ps) {
      try {
        const q = activeQuests.get(p.id);
        if (!q || q.questType !== TYPE_ENTITY) continue;
        if (p.dimension.getEntities({ location: p.location, maxDistance: 3, type: q.targetId }).length > 0) {
          complete(p, q);
        }
      } catch (e) {
        console.warn("[Quest] entity-check error:", e);
      }
    }
  }, CHECK_INTERVAL);

  // ── Block break → complete ────────────────────────────────────────────────
  try {
    world.afterEvents.playerBreakBlock.subscribe((ev) => {
      try {
        const p = ev.player;
        const q = activeQuests.get(p.id);
        if (!q || q.questType !== TYPE_BLOCK) return;
        // ev.brokenBlockPermutation.type.id  e.g. "minecraft:diamond_ore"
        const blockId = ev.brokenBlockPermutation.type.id;
        if (blockId === q.targetId) {
          complete(p, q);
        }
      } catch (e) {
        console.warn("[Quest] playerBreakBlock handler error:", e);
      }
    });
  } catch (e) {
    console.warn("[Quest] Could not subscribe to playerBreakBlock:", e);
  }

  // ── Block place → complete ────────────────────────────────────────────────
  try {
    world.afterEvents.playerPlaceBlock.subscribe((ev) => {
      try {
        const p = ev.player;
        const q = activeQuests.get(p.id);
        if (!q || q.questType !== TYPE_BLOCK) return;
        // ev.block.typeId  e.g. "minecraft:diamond_ore"
        const blockId = ev.block.typeId;
        if (blockId === q.targetId) {
          complete(p, q);
        }
      } catch (e) {
        console.warn("[Quest] playerPlaceBlock handler error:", e);
      }
    });
  } catch (e) {
    console.warn("[Quest] Could not subscribe to playerPlaceBlock:", e);
  }

  // ── Timeout + restart (200-tick poll) ─────────────────────────────────────
  system.runInterval(() => {
    const ct = system.currentTick;
    let ps;
    try { ps = world.getAllPlayers(); } catch (e) { return; }
    for (const p of ps) {
      try {
        const q = activeQuests.get(p.id);
        if (q && ct - q.startTick > QUEST_TIMEOUT) {
          cancel(p);
          system.runTimeout(() => { if (!activeQuests.has(p.id)) startQuest(p); }, 60);
        }
      } catch (e) {
        console.warn("[Quest] timeout-restart error:", e);
      }
    }
  }, 200);

  console.warn("[Quest] Quest system v2.6 started (entity + block quests)");
}
