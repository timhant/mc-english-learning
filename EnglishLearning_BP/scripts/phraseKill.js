// phraseKill.js - v3.0 Phrase trigger for entity kills
import { world } from "@minecraft/server";
import { killPhraseMap } from "./phraseData.js";
import { hasLearnedNoun, showPhrase } from "./phraseCore.js";

export function startPhraseKill() {
  world.afterEvents.entityDie.subscribe((event) => {
    try {
      const dead = event.deadEntity;
      const source = event.damageSource;

      // Check if killer is a player
      const killer = source.damagingEntity;
      if (!killer || killer.typeId !== "minecraft:player") return;

      // Look up phrase for this entity
      const entityId = dead.typeId;
      const phraseEntry = killPhraseMap.get(entityId);
      if (!phraseEntry) return;

      // Check if player has learned the prerequisite noun
      if (!hasLearnedNoun(killer, phraseEntry.requires)) return;

      // Show phrase
      showPhrase(killer, phraseEntry, phraseEntry.level);
    } catch (e) {}
  });
}
