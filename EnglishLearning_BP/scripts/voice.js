// voice.js - Voice playback with global playback lock
import { system } from "@minecraft/server";
import { CONFIG } from "./config.js";

// --- Playback Lock ---
// Prevents audio overlap when multiple words trigger simultaneously
const playerLocks = new Map(); // playerId -> true/false

function isLocked(playerId) {
  return playerLocks.get(playerId) === true;
}

function setLock(playerId) {
  playerLocks.set(playerId, true);
  system.runTimeout(() => {
    playerLocks.set(playerId, false);
  }, CONFIG.playLockTicks);
}

// --- Special ID -> audio key mapping ---
const SPECIAL_MAP = {
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
  // v2.5 new mappings
  "minecraft:flower_pot": "flower_pot",
  "minecraft:moss_carpet": "moss_carpet",
  "minecraft:dark_oak_log": "dark_oak_log",
  "minecraft:mangrove_log": "mangrove_log",
  "minecraft:cherry_log": "cherry_log",
  "minecraft:note_block": "note_block",
  "minecraft:tripwire_hook": "tripwire_hook",
  "minecraft:pressure_plate": "pressure_plate",
  "minecraft:cartography_table": "cartography_table",
  "minecraft:fletching_table": "fletching_table",
  "minecraft:ender_chest": "ender_chest",
  "minecraft:armor_stand": "armor_stand",
  "minecraft:decorated_pot": "decorated_pot",
  "minecraft:chiseled_bookshelf": "chiseled_bookshelf",
  "minecraft:suspicious_sand": "suspicious_sand",
  "minecraft:suspicious_gravel": "suspicious_gravel",
  "minecraft:coral_block": "coral",
  "minecraft:lightning_rod": "lightning_rod",
  "minecraft:glow_lichen": "glow_lichen",
  "minecraft:flowering_azalea": "flowering_azalea",
  "minecraft:pointed_dripstone": "pointed_dripstone",
  "minecraft:dripstone_block": "dripstone",
  "minecraft:moss_block": "moss",
  "minecraft:amethyst_block": "amethyst",
  "minecraft:copper_block": "copper_block",
  "minecraft:crimson_stem": "crimson_stem",
  "minecraft:warped_stem": "warped_stem",
  "minecraft:crimson_planks": "crimson_planks",
  "minecraft:warped_planks": "warped_planks",
  "minecraft:crimson_fungus": "crimson_fungus",
  "minecraft:warped_fungus": "warped_fungus",
  "minecraft:crimson_roots": "crimson_roots",
  "minecraft:warped_roots": "warped_roots",
  "minecraft:twisting_vines": "twisting_vines",
  "minecraft:weeping_vines": "weeping_vines",
  "minecraft:nether_sprouts": "nether_sprouts",
  "minecraft:gilded_blackstone": "gilded_blackstone",
  "minecraft:quartz_block": "quartz",
  "minecraft:soul_campfire": "soul_campfire",
  "minecraft:nether_gold_ore": "nether_gold_ore",
  "minecraft:ancient_debris": "ancient_debris",
  "minecraft:crying_obsidian": "crying_obsidian",
  "minecraft:nether_wart": "nether_wart",
  "minecraft:sculk_shrieker": "sculk_shrieker",
  "minecraft:sculk_catalyst": "sculk_catalyst",
  "minecraft:polished_basalt": "polished_basalt",
  "minecraft:polished_blackstone": "polished_blackstone",
  "minecraft:warp_wart_block": "warped_wart_block",
  "minecraft:nether_wart_block": "nether_wart_block",
  "minecraft:reinforced_deepslate": "reinforced_deepslate",
  "minecraft:heavy_core": "heavy_core",
  "minecraft:trial_spawner": "trial_spawner",
  "minecraft:copper_bulb": "copper_bulb",
  "minecraft:copper_grate": "copper_grate",
  "minecraft:tinted_glass": "tinted_glass",
  "minecraft:purpur_pillar": "purpur_pillar",
  "minecraft:copper_door": "copper_door",
  "minecraft:copper_trapdoor": "copper_trapdoor",
  "minecraft:chorus_plant": "chorus_plant",
  "minecraft:chorus_flower": "chorus_flower",
  "minecraft:dragon_egg": "dragon_egg",
  "minecraft:end_rod": "end_rod",
  "minecraft:emerald_block": "emerald_block",
  "minecraft:netherite_block": "netherite_block",
  "minecraft:shulker_box": "shulker_box",
  // Item special mappings
  "minecraft:wooden_sword": "wooden_sword",
  "minecraft:wooden_pickaxe": "wooden_pickaxe",
  "minecraft:wooden_axe": "wooden_axe",
  "minecraft:wooden_shovel": "wooden_shovel",
  "minecraft:wooden_hoe": "wooden_hoe",
  "minecraft:stone_sword": "stone_sword",
  "minecraft:stone_pickaxe": "stone_pickaxe",
  "minecraft:stone_axe": "stone_axe",
  "minecraft:wheat_seeds": "seeds",
  "minecraft:iron_sword": "iron_sword",
  "minecraft:iron_pickaxe": "iron_pickaxe",
  "minecraft:iron_axe": "iron_axe",
  "minecraft:iron_shovel": "iron_shovel",
  "minecraft:iron_hoe": "iron_hoe",
  "minecraft:iron_helmet": "iron_helmet",
  "minecraft:iron_chestplate": "iron_chestplate",
  "minecraft:iron_leggings": "iron_leggings",
  "minecraft:iron_boots": "iron_boots",
  "minecraft:iron_ingot": "iron_ingot",
  "minecraft:gold_ingot": "gold_ingot",
  "minecraft:fishing_rod": "fishing_rod",
  "minecraft:flint_and_steel": "flint_and_steel",
  "minecraft:cooked_beef": "steak",
  "minecraft:cooked_porkchop": "porkchop",
  "minecraft:cooked_chicken": "cooked_chicken",
  "minecraft:milk_bucket": "milk",
  "minecraft:name_tag": "name_tag",
  "minecraft:melon_slice": "melon_slice",
  "minecraft:sweet_berries": "sweet_berries",
  "minecraft:mushroom_stew": "mushroom_stew",
  "minecraft:raw_beef": "raw_beef",
  "minecraft:raw_porkchop": "raw_porkchop",
  "minecraft:raw_chicken": "raw_chicken",
  "minecraft:rotten_flesh": "rotten_flesh",
  "minecraft:gold_sword": "golden_sword",
  "minecraft:gold_pickaxe": "golden_pickaxe",
  "minecraft:leather_helmet": "leather_helmet",
  "minecraft:chainmail_helmet": "chainmail_helmet",
  "minecraft:pumpkin_pie": "pumpkin_pie",
  "minecraft:honey_bottle": "honey_bottle",
  "minecraft:copper_ingot": "copper_ingot",
  "minecraft:raw_iron": "raw_iron",
  "minecraft:raw_gold": "raw_gold",
  "minecraft:raw_copper": "raw_copper",
  "minecraft:dried_kelp": "dried_kelp",
  "minecraft:suspicious_stew": "suspicious_stew",
  "minecraft:diamond_sword": "diamond_sword",
  "minecraft:diamond_pickaxe": "diamond_pickaxe",
  "minecraft:diamond_axe": "diamond_axe",
  "minecraft:diamond_shovel": "diamond_shovel",
  "minecraft:diamond_helmet": "diamond_helmet",
  "minecraft:diamond_chestplate": "diamond_chestplate",
  "minecraft:diamond_leggings": "diamond_leggings",
  "minecraft:diamond_boots": "diamond_boots",
  "minecraft:golden_apple": "golden_apple",
  "minecraft:experience_bottle": "experience_bottle",
  "minecraft:enchanted_book": "enchanted_book",
  "minecraft:ender_pearl": "ender_pearl",
  "minecraft:slime_ball": "slime_ball",
  "minecraft:lapis_lazuli": "lapis_lazuli",
  "minecraft:glowstone_dust": "glowstone_dust",
  "minecraft:glass_bottle": "glass_bottle",
  "minecraft:spider_eye": "spider_eye",
  "minecraft:fermented_spider_eye": "fermented_spider_eye",
  "minecraft:phantom_membrane": "phantom_membrane",
  "minecraft:rabbit_foot": "rabbit_foot",
  "minecraft:glow_ink_sac": "glow_ink_sac",
  "minecraft:amethyst_shard": "amethyst_shard",
  "minecraft:splash_potion": "splash_potion",
  "minecraft:lingering_potion": "lingering_potion",
  "minecraft:tipped_arrow": "tipped_arrow",
  "minecraft:prismarine_shard": "prismarine_shard",
  "minecraft:prismarine_crystals": "prismarine_crystals",
  "minecraft:goat_horn": "goat_horn",
  "minecraft:netherite_sword": "netherite_sword",
  "minecraft:netherite_pickaxe": "netherite_pickaxe",
  "minecraft:netherite_axe": "netherite_axe",
  "minecraft:netherite_helmet": "netherite_helmet",
  "minecraft:netherite_chestplate": "netherite_chestplate",
  "minecraft:netherite_leggings": "netherite_leggings",
  "minecraft:netherite_boots": "netherite_boots",
  "minecraft:blaze_rod": "blaze_rod",
  "minecraft:blaze_powder": "blaze_powder",
  "minecraft:nether_star": "nether_star",
  "minecraft:ghast_tear": "ghast_tear",
  "minecraft:magma_cream": "magma_cream",
  "minecraft:netherite_ingot": "netherite_ingot",
  "minecraft:netherite_scrap": "netherite_scrap",
  "minecraft:gold_nugget": "gold_nugget",
  "minecraft:soul_lantern": "soul_lantern",
  "minecraft:warped_fungus_on_a_stick": "warped_fungus_on_a_stick",
  "minecraft:fire_charge": "fire_charge",
  "minecraft:ender_eye": "eye_of_ender",
  "minecraft:wither_skeleton_skull": "wither_skull",
  "minecraft:armor_trim_smithing_template": "smithing_template",
  "minecraft:soul_torch": "soul_torch",
  "minecraft:warped_door": "warped_door",
  "minecraft:lodestone_compass": "lodestone_compass",
  "minecraft:spectral_arrow": "spectral_arrow",
  "minecraft:totem_of_undying": "totem_of_undying",
  "minecraft:end_crystal": "end_crystal",
  "minecraft:chorus_fruit": "chorus_fruit",
  "minecraft:dragon_breath": "dragon_breath",
  "minecraft:firework_rocket": "firework_rocket",
  "minecraft:recovery_compass": "recovery_compass",
  "minecraft:echo_shard": "echo_shard",
  "minecraft:disc_fragment_5": "disc_fragment",
  "minecraft:heart_of_the_sea": "heart_of_the_sea",
  "minecraft:nautilus_shell": "nautilus_shell",
  "minecraft:turtle_helmet": "turtle_helmet",
  "minecraft:wind_charge": "wind_charge",
  "minecraft:trial_key": "trial_key",
  "minecraft:ominous_trial_key": "ominous_trial_key",
  "minecraft:ominous_bottle": "ominous_bottle",
  "minecraft:wolf_armor": "wolf_armor",
  "minecraft:shulker_shell": "shulker_shell",
  "minecraft:music_disc_pigstep": "music_disc",
  "minecraft:globe_banner_pattern": "globe_banner_pattern",
  "minecraft:creeper_banner_pattern": "creeper_banner_pattern",
  "minecraft:spire_armor_trim_smithing_template": "spire_armor_trim",
  "minecraft:eye_armor_trim_smithing_template": "eye_armor_trim",
  "minecraft:zombified_piglin": "zombified_piglin",
  "minecraft:piglin_brute": "piglin_brute",
  "minecraft:glow_squid": "glow_squid",
  "minecraft:ender_dragon": "ender_dragon",
};

/**
 * Get audio key from minecraft ID
 */
export function getAudioKey(minecraftId) {
  if (SPECIAL_MAP[minecraftId]) return SPECIAL_MAP[minecraftId];
  return minecraftId.replace("minecraft:", "");
}

/**
 * Play English + Chinese audio for a word.
 * Returns true if played, false if blocked by lock.
 */
export function playWordAudio(player, minecraftId) {
  if (!CONFIG.voiceEnabled) return false;
  if (isLocked(player.id)) return false;

  const key = getAudioKey(minecraftId);
  setLock(player.id);

  try {
    const dim = player.dimension;
    const sel = '@a[name="' + player.name + '"]';
    const pos = player.location;
    const x = pos.x.toFixed(1);
    const y = pos.y.toFixed(1);
    const z = pos.z.toFixed(1);

    dim.runCommand("playsound eng." + key + "_en " + sel + " " + x + " " + y + " " + z + " 1 1");

    system.runTimeout(() => {
      try {
        const p = player.location;
        dim.runCommand("playsound eng." + key + "_cn " + sel + " " + p.x.toFixed(1) + " " + p.y.toFixed(1) + " " + p.z.toFixed(1) + " 1 1");
      } catch (e) {}
    }, 30);
  } catch (e) {}

  return true;
}
