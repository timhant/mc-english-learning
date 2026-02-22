// main.js - English Learning Addon Entry Point
// Learn English while playing Minecraft! 边玩边学英语！
// Target: 5-6 year old preschool children on BDS 1.26.1.1

import { world, system } from "@minecraft/server";
import { startProximityDetection } from "./proximity.js";
import { startBlockLearning } from "./blockLearn.js";
import { startQuestSystem } from "./quest.js";
import { showAlbum } from "./progress.js";

// Initialize all modules
startProximityDetection();
startBlockLearning();
startQuestSystem();

// Register /words command for parents to check progress
world.beforeEvents.chatSend.subscribe((event) => {
  const msg = event.message.trim().toLowerCase();

  if (msg === "/words" || msg === "/album" || msg === "/图鉴") {
    event.cancel = true;
    // Defer to next tick (can't send messages in beforeEvents)
    const player = event.sender;
    system.runTimeout(() => {
      showAlbum(player);
    }, 1);
  }
});

// Welcome message when player joins
world.afterEvents.playerSpawn.subscribe((event) => {
  if (event.initialSpawn) {
    const player = event.player;
    try {
      player.sendMessage(
        "§a§l🎓 英语启蒙 English Learning§r"
      );
      player.sendMessage(
        "§f探索世界，学习英语！Explore and learn!§r"
      );
      player.sendMessage(
        "§7靠近动物或挖掘方块来学习新单词§r"
      );
      player.sendMessage(
        "§7Walk near animals or mine blocks to learn words§r"
      );
      player.sendMessage(
        '§7输入 /words 查看图鉴 | Type /words to see album§r'
      );
    } catch (e) {
      // ignore
    }
  }
});
