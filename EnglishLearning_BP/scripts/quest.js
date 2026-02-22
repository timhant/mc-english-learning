// quest.js - Automatic find-the-animal quests for kids
import { world, system } from "@minecraft/server";
import { entities, rewardItems } from "./vocabulary.js";

// Active quests per player: Map<playerId, { targetId, targetEn, targetCn, startTick }>
const activeQuests = new Map();
const QUEST_INTERVAL = 6000; // 5 minutes (300 seconds * 20 tps)
const QUEST_TIMEOUT = 6000; // 5 minutes to find it
const QUEST_DETECT_RANGE = 3;
const CHECK_INTERVAL = 20; // check every second

/**
 * Pick a random entity target for quest
 */
function pickQuestTarget() {
  const idx = Math.floor(Math.random() * entities.length);
  return entities[idx];
}

/**
 * Start a new quest for a player
 */
async function startQuest(player) {
  const target = pickQuestTarget();
  const currentTick = system.currentTick;

  activeQuests.set(player.id, {
    targetId: target.id,
    targetEn: target.en,
    targetCn: target.cn,
    startTick: currentTick,
  });

  try {
    // Announce quest with big title
    const titleJson = JSON.stringify({
      rawtext: [{ text: `§d§l🔍 FIND: ${target.en}§r` }],
    });
    await player.runCommandAsync(`titleraw @s title ${titleJson}`);

    const subtitleJson = JSON.stringify({
      rawtext: [{ text: `§f找到: ${target.cn}!§r` }],
    });
    await player.runCommandAsync(`titleraw @s subtitle ${subtitleJson}`);
    await player.runCommandAsync("titleraw @s times 10 60 10");
    await player.runCommandAsync("playsound note.pling @s");
  } catch (e) {
    // ignore
  }
}

/**
 * Complete a quest - give rewards
 */
async function completeQuest(player, quest) {
  activeQuests.delete(player.id);

  try {
    // Success title
    const titleJson = JSON.stringify({
      rawtext: [{ text: `§a§l✅ ${quest.targetEn}!§r` }],
    });
    await player.runCommandAsync(`titleraw @s title ${titleJson}`);

    const subtitleJson = JSON.stringify({
      rawtext: [{ text: `§a太棒了! Great job! §e⭐§r` }],
    });
    await player.runCommandAsync(`titleraw @s subtitle ${subtitleJson}`);
    await player.runCommandAsync("titleraw @s times 10 40 10");

    // Sound + XP
    await player.runCommandAsync("playsound random.toast @s");
    await player.runCommandAsync("xp 5 @s");

    // Random food reward
    const reward =
      rewardItems[Math.floor(Math.random() * rewardItems.length)];
    const amount = Math.floor(Math.random() * 3) + 1;
    await player.runCommandAsync(`give @s ${reward} ${amount}`);

    // Particle celebration
    await player.runCommandAsync(
      `particle minecraft:totem_particle ~ ~1 ~`
    );
  } catch (e) {
    // ignore
  }
}

/**
 * Cancel a timed-out quest
 */
async function cancelQuest(player) {
  const quest = activeQuests.get(player.id);
  activeQuests.delete(player.id);

  if (!quest) return;

  try {
    const abJson = JSON.stringify({
      rawtext: [
        {
          text: `§7⏰ 任务超时 Time's up! ${quest.targetEn} 下次再找!§r`,
        },
      ],
    });
    await player.runCommandAsync(`titleraw @s actionbar ${abJson}`);
  } catch (e) {
    // ignore
  }
}

/**
 * Start the quest system
 */
export function startQuestSystem() {
  // Quest assignment timer - check if players need new quests
  system.runInterval(() => {
    const currentTick = system.currentTick;
    const players = world.getAllPlayers();

    for (const player of players) {
      const quest = activeQuests.get(player.id);

      if (!quest) {
        // No active quest, start one
        startQuest(player);
      } else if (currentTick - quest.startTick > QUEST_TIMEOUT) {
        // Quest timed out
        cancelQuest(player);
      }
    }
  }, QUEST_INTERVAL);

  // Quest completion checker - runs every second
  system.runInterval(() => {
    const players = world.getAllPlayers();

    for (const player of players) {
      const quest = activeQuests.get(player.id);
      if (!quest) continue;

      try {
        // Check for target entity nearby
        const nearby = player.dimension.getEntities({
          location: player.location,
          maxDistance: QUEST_DETECT_RANGE,
          type: quest.targetId,
        });

        if (nearby.length > 0) {
          completeQuest(player, quest);
        }
      } catch (e) {
        // ignore
      }
    }
  }, CHECK_INTERVAL);

  // Also check timeout more frequently
  system.runInterval(() => {
    const currentTick = system.currentTick;
    const players = world.getAllPlayers();

    for (const player of players) {
      const quest = activeQuests.get(player.id);
      if (quest && currentTick - quest.startTick > QUEST_TIMEOUT) {
        cancelQuest(player);
        // Start new quest after brief delay
        system.runTimeout(() => {
          if (!activeQuests.has(player.id)) {
            startQuest(player);
          }
        }, 60); // 3 second delay
      }
    }
  }, 200); // check every 10 seconds
}
