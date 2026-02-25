// phraseEvent.js - v3.0.2 Phrase trigger for weather changes and player status
// Fix: edge-triggered status detection (only fires on state CHANGE, not continuously)
import { world, system } from "@minecraft/server";
import { weatherPhrases, statusPhrases } from "./phraseData.js";
import { showPhrase } from "./phraseCore.js";

const STATUS_CHECK_INTERVAL = 60; // every 3 seconds

// Track previous states per player for edge detection
const lastDimension = new Map();    // playerId -> dimensionId
const lastHealthState = new Map();  // playerId -> "full"|"low"|"normal"
const lastOnFire = new Map();       // playerId -> boolean
const lastDrowning = new Map();     // playerId -> boolean
const lastGliding = new Map();      // playerId -> boolean

/**
 * Edge detector: returns true only on state transition (false -> true)
 */
function edgeRising(map, playerId, currentState) {
  const prev = map.get(playerId) || false;
  map.set(playerId, currentState);
  return !prev && currentState; // only trigger on false -> true
}

export function startPhraseEvents() {
  // --- Weather change ---
  try {
    world.afterEvents.weatherChange.subscribe((event) => {
      try {
        const players = world.getAllPlayers();
        for (const player of players) {
          if (player.dimension.id !== "minecraft:overworld") continue;

          let eventType = null;
          if (event.newWeather === "rain" || event.newWeather === "Rain") {
            eventType = "rain";
          } else if (event.newWeather === "thunder" || event.newWeather === "Thunder") {
            eventType = "thunder";
          } else if (event.newWeather === "clear" || event.newWeather === "Clear") {
            eventType = "clear";
          }

          if (!eventType) return;

          const phrase = weatherPhrases.find(p => p.event === eventType);
          if (phrase) {
            showPhrase(player, phrase, phrase.level);
          }
        }
      } catch (e) {}
    });
  } catch (e) {
    // weatherChange may not be available
  }

  // --- Status detection (tick-based, EDGE-TRIGGERED) ---
  system.runInterval(() => {
    try {
      const players = world.getAllPlayers();

      for (const player of players) {
        try {
          const pid = player.id;

          // Fire detection (edge: not on fire -> on fire)
          const onFire = !!player.getComponent("minecraft:onfire");
          if (edgeRising(lastOnFire, pid, onFire)) {
            const phrase = statusPhrases.find(p => p.event === "fire");
            if (phrase) showPhrase(player, phrase, phrase.level);
          }

          // Drowning detection (edge: not drowning -> drowning)
          let isDrowning = false;
          try {
            if (player.isInWater) {
              const eyePos = {
                x: Math.floor(player.location.x),
                y: Math.floor(player.location.y + 1.62),
                z: Math.floor(player.location.z)
              };
              const eyeBlock = player.dimension.getBlock(eyePos);
              if (eyeBlock && (eyeBlock.typeId === "minecraft:water" || eyeBlock.typeId === "minecraft:flowing_water")) {
                isDrowning = true;
              }
            }
          } catch (e) {}
          if (edgeRising(lastDrowning, pid, isDrowning)) {
            const phrase = statusPhrases.find(p => p.event === "drowning");
            if (phrase) showPhrase(player, phrase, phrase.level);
          }

          // Health detection (edge: state transition only)
          const health = player.getComponent("minecraft:health");
          if (health) {
            const ratio = health.currentValue / health.effectiveMax;
            let state = "normal";
            if (ratio <= 0.25) state = "low";
            else if (ratio >= 1.0) state = "full";

            const prevState = lastHealthState.get(pid) || "normal";
            lastHealthState.set(pid, state);

            // Only trigger on state CHANGE
            if (state !== prevState) {
              if (state === "low") {
                const phrase = statusPhrases.find(p => p.event === "low_health");
                if (phrase) showPhrase(player, phrase, phrase.level);
              } else if (state === "full" && prevState === "low") {
                // Only trigger full_health when recovering FROM low health
                const phrase = statusPhrases.find(p => p.event === "full_health");
                if (phrase) showPhrase(player, phrase, phrase.level);
              }
            }
          }

          // Dimension change detection
          const currentDim = player.dimension.id;
          const lastDim = lastDimension.get(pid);
          if (lastDim && lastDim !== currentDim) {
            let eventType = null;
            if (currentDim === "minecraft:nether") eventType = "nether_enter";
            else if (lastDim === "minecraft:nether" && currentDim === "minecraft:overworld") eventType = "nether_leave";
            else if (currentDim === "minecraft:the_end") eventType = "end_enter";

            if (eventType) {
              const phrase = statusPhrases.find(p => p.event === eventType);
              if (phrase) showPhrase(player, phrase, phrase.level);
            }
          }
          lastDimension.set(pid, currentDim);

          // Elytra flight detection (edge: not gliding -> gliding)
          try {
            if (edgeRising(lastGliding, pid, !!player.isGliding)) {
              const phrase = statusPhrases.find(p => p.event === "elytra_fly");
              if (phrase) showPhrase(player, phrase, phrase.level);
            }
          } catch (e) {}

          // Night detection (overworld only, narrow window)
          if (currentDim === "minecraft:overworld") {
            try {
              const time = world.getTimeOfDay();
              if (time >= 12500 && time <= 12600) {
                const phrase = statusPhrases.find(p => p.event === "night");
                if (phrase) showPhrase(player, phrase, phrase.level);
              }
            } catch (e) {}
          }
        } catch (e) {}
      }
    } catch (e) {}
  }, STATUS_CHECK_INTERVAL);

  // --- Death/Respawn detection ---
  try {
    world.afterEvents.playerSpawn.subscribe((event) => {
      if (!event.initialSpawn) {
        const phrase = statusPhrases.find(p => p.event === "respawn");
        if (phrase) {
          system.runTimeout(() => {
            showPhrase(event.player, phrase, phrase.level);
          }, 20);
        }
      }
    });
  } catch (e) {}
}
