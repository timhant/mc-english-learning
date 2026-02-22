// levelUp.js - Level up celebration effects
import { system } from "@minecraft/server";
import { levels } from "./vocab/index.js";

export function celebrateLevelUp(player, newLevel) {
  try {
    const dim = player.dimension;
    const sel = '@a[name="' + player.name + '"]';
    const lvl = levels[newLevel - 1];
    if (!lvl) return;

    // Big title
    const titleJson = JSON.stringify({ rawtext: [{ text: "§6§l⭐ LEVEL UP! ⭐§r" }] });
    dim.runCommand("titleraw " + sel + " title " + titleJson);

    const subJson = JSON.stringify({ rawtext: [{ text: "§eLv." + newLevel + " " + lvl.nameCn + " " + lvl.name + "§r" }] });
    dim.runCommand("titleraw " + sel + " subtitle " + subJson);
    dim.runCommand("titleraw " + sel + " times 10 80 20");

    // Sound + XP
    dim.runCommand("playsound random.toast " + sel);
    dim.runCommand("xp " + (newLevel * 10) + " " + sel);

    // Particles
    dim.runCommand("particle minecraft:totem_particle ~ ~2 ~");

    // Delayed congratulation message
    system.runTimeout(() => {
      try {
        const msgJson = JSON.stringify({ rawtext: [{ text: "§a§l🎉 恭喜升级！Congratulations!§r\n§f新主题已解锁：" + lvl.star + " " + lvl.nameCn + " " + lvl.name + "\n§7继续探索学习更多单词吧！§r" }] });
        dim.runCommand("tellraw " + sel + " " + msgJson);
      } catch (e) {}
    }, 60); // 3 seconds later
  } catch (e) {}
}
