import { world, system } from "@minecraft/server";
import { startProximityDetection } from "./proximity.js";
import { startBlockLearning } from "./blockLearn.js";
import { startQuestSystem } from "./quest.js";
import { showAlbum } from "./progress.js";

console.warn("[English Learning] Loading addon...");
try { startProximityDetection(); console.warn("[English Learning] Proximity OK"); } catch (e) { console.warn("[English Learning] Proximity FAIL: " + e); }
try { startBlockLearning(); console.warn("[English Learning] BlockLearn OK"); } catch (e) { console.warn("[English Learning] BlockLearn FAIL: " + e); }
try { startQuestSystem(); console.warn("[English Learning] Quest OK"); } catch (e) { console.warn("[English Learning] Quest FAIL: " + e); }

world.afterEvents.playerSpawn.subscribe((event) => {
  if (event.initialSpawn) {
    const p = event.player;
    system.runTimeout(() => {
      try {
        const dim = p.dimension;
        const n = p.name;
        const msg = JSON.stringify({ rawtext: [{ text: "§a§l🎓 英语启蒙 English Learning§r\n§f探索世界，学习英语！\n§7靠近动物或挖方块来学习新单词§r" }] });
        dim.runCommand('tellraw "' + n + '" ' + msg);
      } catch (e) {}
    }, 40);
  }
});

console.warn("[English Learning] Addon loaded!");
