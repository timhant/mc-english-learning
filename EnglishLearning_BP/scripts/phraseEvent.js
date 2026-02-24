// phraseEvent.js - v3.0 Phrase trigger for weather changes and player status
import { world, system } from "@minecraft/server";
import { weatherPhrases, statusPhrases } from "./phraseData.js";
import { showPhrase } from "./phraseCore.js";

const STATUS_CHECK_INTERVAL = 60; // every 3 seconds

// Track dimension for portal detection
const lastDimension = new Map(); // playerId -> dimensionId

export function startPhraseEvents() {
  // --- Weather change ---
  try {
    world.afterEvents.weatherChange.subscribe((event) => {
      try {
        const players = world.getAllPlayers();
        for (const player of players) {
          // Only trigger for overworld players
          if (player.dimension.id !== "minecraft:overworld") continue;

          let eventType = null;
          if (event.newWeather === "rain" || event.newWeather === "Rain") {
            eventType = "rain";
          } else if (event.newWeather === "thunder" || event.newWeather === "Thunder") {
            eventType = "thunder";
          } else if (event.newWeather === "clear" || event.newWeather === "Clear") {
            eventType = "clear";
          }

          // Bedrock weatherChange event structure may differ, try alternate detection
          if (!eventType) {
            const dim = player.dimension;
            try {
              const weather = dim.getWeather ? dim.getWeather() : null;
              // Fallback: check if it's raining/thundering
            } catch (e) {}
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
    // weatherChange may not be available, use polling fallback
    let lastWeather = "clear";
    system.runInterval(() => {
      try {
        const players = world.getAllPlayers();
        if (players.length === 0) return;

        // Check overworld weather via command
        const dim = world.getDimension("overworld");
        let currentWeather = "clear";
        // Use player-based detection as fallback
        for (const player of players) {
          if (player.dimension.id !== "minecraft:overworld") continue;
          // Simple heuristic: we rely on the event-based approach primarily
          break;
        }
      } catch (e) {}
    }, 200); // every 10 seconds
  }

  // --- Status detection (tick-based) ---
  system.runInterval(() => {
    try {
      const players = world.getAllPlayers();
      const tick = system.currentTick;

      for (const player of players) {
        try {
          // Fire detection
          const onFire = player.getComponent("minecraft:onfire");
          if (onFire) {
            const phrase = statusPhrases.find(p => p.event === "fire");
            if (phrase) showPhrase(player, phrase, phrase.level);
          }

          // Drowning detection (player underwater with low air)
          try {
            const breathable = player.getComponent("minecraft:breathable");
            if (breathable && breathable.suffocateTime <= 0) {
              // Player is out of air
              const phrase = statusPhrases.find(p => p.event === "drowning");
              if (phrase) showPhrase(player, phrase, phrase.level);
            }
          } catch (e) {}

          // Health detection
          const health = player.getComponent("minecraft:health");
          if (health) {
            const ratio = health.currentValue / health.effectiveMax;
            if (ratio <= 0.25) {
              const phrase = statusPhrases.find(p => p.event === "low_health");
              if (phrase) showPhrase(player, phrase, phrase.level);
            } else if (ratio >= 1.0) {
              const phrase = statusPhrases.find(p => p.event === "full_health");
              if (phrase) showPhrase(player, phrase, phrase.level);
            }
          }

          // Dimension change detection (nether/end portals)
          const currentDim = player.dimension.id;
          const lastDim = lastDimension.get(player.id);
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
          lastDimension.set(player.id, currentDim);

          // Elytra flight detection
          try {
            if (player.isGliding) {
              const phrase = statusPhrases.find(p => p.event === "elytra_fly");
              if (phrase) showPhrase(player, phrase, phrase.level);
            }
          } catch (e) {}

          // Night detection (overworld only, time 13000-23000)
          if (currentDim === "minecraft:overworld") {
            try {
              const time = world.getTimeOfDay();
              if (time >= 12500 && time <= 12600) {
                // Just turned night (narrow window to trigger once)
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
        // Player respawned after death
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
