// voice.js - Voice playback for word learning
import { system } from "@minecraft/server";
import { CONFIG } from "./config.js";

// Map minecraft IDs to audio keys
const ID_TO_KEY = new Map();

// Build from all vocab data
function buildKeyMap() {
  // key pattern: "minecraft:cow" -> "cow", "minecraft:iron_ore" -> "iron_ore"
  // Special cases handled explicitly
  const specialMap = {
    "minecraft:grass_block": "grass",
    "minecraft:villager_v2": "villager",
    "minecraft:melon_block": "melon",
    "minecraft:bamboo_block": "bamboo",
    "minecraft:red_flower": "flower",
    "minecraft:brown_mushroom": "mushroom",
    "minecraft:sugarcane": "sugar_cane",
    "minecraft:hay_block": "hay",
    "minecraft:brick_block": "brick",
    "minecraft:mossy_cobblestone": "mossy_stone",
    "minecraft:stonebrick": "stone_brick",
    "minecraft:stonecutter_block": "stonecutter",
    "minecraft:wandering_trader": "trader",
    "minecraft:mob_spawner": "spawner",
    "minecraft:bone_block": "bone_block",
    "minecraft:respawn_anchor": "respawn_anchor",
    "minecraft:sticky_piston": "sticky_piston",
    "minecraft:redstone_block": "redstone_block",
    "minecraft:daylight_detector": "daylight_sensor",
    "minecraft:nether_brick": "nether_brick",
    "minecraft:end_bricks": "end_brick",
    "minecraft:purpur_block": "purpur_block",
    "minecraft:sea_lantern": "sea_lantern",
    "minecraft:sculk_sensor": "sculk_sensor",
    "minecraft:tropicalfish": "tropical_fish",
    "minecraft:cave_spider": "cave_spider",
    "minecraft:wither_skeleton": "wither_skeleton",
    "minecraft:magma_cube": "magma_cube",
    "minecraft:elder_guardian": "elder_guardian",
    "minecraft:snow_golem": "snow_golem",
    "minecraft:iron_golem": "iron_golem",
    "minecraft:iron_ore": "iron_ore",
    "minecraft:gold_ore": "gold_ore",
    "minecraft:diamond_ore": "diamond_ore",
    "minecraft:coal_ore": "coal_ore",
    "minecraft:copper_ore": "copper_ore",
    "minecraft:redstone_ore": "redstone_ore",
    "minecraft:lapis_ore": "lapis_ore",
    "minecraft:emerald_ore": "emerald_ore",
    "minecraft:iron_block": "iron_block",
    "minecraft:gold_block": "gold_block",
    "minecraft:diamond_block": "diamond_block",
    "minecraft:oak_log": "oak_log",
    "minecraft:oak_planks": "oak_planks",
    "minecraft:birch_log": "birch_log",
    "minecraft:spruce_log": "spruce_log",
    "minecraft:jungle_log": "jungle_log",
    "minecraft:acacia_log": "acacia_log",
    "minecraft:crafting_table": "crafting_table",
    "minecraft:smithing_table": "smithing_table",
    "minecraft:blast_furnace": "blast_furnace",
    "minecraft:enchanting_table": "enchanting_table",
    "minecraft:brewing_stand": "brewing_stand",
    "minecraft:soul_sand": "soul_sand",
    "minecraft:end_stone": "end_stone",
    "minecraft:polar_bear": "polar_bear",
    "minecraft:lily_pad": "lily_pad",
    "minecraft:sugar_cane": "sugar_cane",
  };

  return specialMap;
}

const SPECIAL_MAP = buildKeyMap();

/**
 * Get audio key from minecraft ID
 */
export function getAudioKey(minecraftId) {
  if (SPECIAL_MAP[minecraftId]) return SPECIAL_MAP[minecraftId];
  // Default: strip "minecraft:" prefix
  return minecraftId.replace("minecraft:", "");
}

/**
 * Play English + Chinese audio for a word
 */
export function playWordAudio(player, minecraftId) {
  if (!CONFIG.voiceEnabled) { console.warn("[Voice] disabled"); return; }

  const key = getAudioKey(minecraftId);
  console.warn("[Voice] Playing: " + key + " for " + player.name);

  try {
    const dim = player.dimension;
    const sel = '@a[name="' + player.name + '"]';

    const pos = player.location;
    const x = pos.x.toFixed(1);
    const y = pos.y.toFixed(1);
    const z = pos.z.toFixed(1);

    const cmd = "playsound eng." + key + "_en " + sel + " " + x + " " + y + " " + z + " 1 1";
    console.warn("[Voice] cmd: " + cmd);
    // Play English audio immediately
    dim.runCommand(cmd);

    // Play Chinese audio after 1.5 seconds (30 ticks)
    system.runTimeout(() => {
      try {
        const p = player.location;
        dim.runCommand("playsound eng." + key + "_cn " + sel + " " + p.x.toFixed(1) + " " + p.y.toFixed(1) + " " + p.z.toFixed(1) + " 1 1");
      } catch (e) {}
    }, 30);
  } catch (e) {}
}
