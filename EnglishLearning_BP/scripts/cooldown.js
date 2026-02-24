// cooldown.js - Shared cooldown pool for nouns and phrases
import { system } from "@minecraft/server";
import { COOLDOWN_TICKS, OUT_OF_LEVEL_COOLDOWN_TICKS } from "./config.js";

const cooldowns = new Map(); // "playerId:wordId" -> tick

export function isOnCooldown(pid, id, inLevel) {
  const k = pid + ":" + id;
  if (!cooldowns.has(k)) return false;
  const limit = inLevel ? COOLDOWN_TICKS : OUT_OF_LEVEL_COOLDOWN_TICKS;
  return system.currentTick - cooldowns.get(k) < limit;
}

export function setCooldown(pid, id) {
  cooldowns.set(pid + ":" + id, system.currentTick);
}
