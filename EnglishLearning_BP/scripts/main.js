// main.js - English Learning Addon v2.0 Entry Point
import { world, system } from "@minecraft/server";
import { startProximityDetection } from "./proximity.js";
import { startBlockLearning } from "./blockLearn.js";
import { startQuestSystem } from "./quest.js";
import { showAlbum, getProgress } from "./progress.js";
import { levels } from "./vocab/index.js";

console.warn("[English Learning v2] Loading...");
try { startProximityDetection(); console.warn("[English Learning v2] Proximity OK"); } catch (e) { console.warn("[English Learning v2] Proximity FAIL: " + e); }
try { startBlockLearning(); console.warn("[English Learning v2] BlockLearn OK"); } catch (e) { console.warn("[English Learning v2] BlockLearn FAIL: " + e); }
try { startQuestSystem(); console.warn("[English Learning v2] Quest OK"); } catch (e) { console.warn("[English Learning v2] Quest FAIL: " + e); }

// Chat commands: /words or /album
try {
  if (world.afterEvents.chatSend) {
    world.afterEvents.chatSend.subscribe((event) => {
      const msg = event.message.trim().toLowerCase();
      if (msg === "/words" || msg === "/album") {
        system.runTimeout(() => { showAlbum(event.sender); }, 1);
      }
    });
  }
} catch (e) {}

// Welcome message on first spawn
world.afterEvents.playerSpawn.subscribe((event) => {
  if (event.initialSpawn) {
    const p = event.player;
    system.runTimeout(() => {
      try {
        const dim = p.dimension;
        const sel = '@a[name="' + p.name + '"]';
        const progress = getProgress(p);
        const lvl = levels[progress.level - 1];
        const msg = JSON.stringify({ rawtext: [{ text:
          "§a§l🎓 英语启蒙 English Learning v2§r\n" +
          "§f当前等级: " + lvl.star + " Lv." + progress.level + " " + lvl.nameCn + "§r\n" +
          "§7靠近动物(2格内)或挖/放方块来学习单词§r\n" +
          "§7输入 /words 查看图鉴§r"
        }] });
        dim.runCommand("tellraw " + sel + " " + msg);
      } catch (e) {}
    }, 40);
  }
});

console.warn("[English Learning v2] Addon loaded! 5 levels, " + levels.reduce((s, l) => s + l.entities.length + l.blocks.length, 0) + " words");
