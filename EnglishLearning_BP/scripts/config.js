// config.js - Runtime configuration
export const CONFIG = {
  unlockThreshold: 0.8,       // % of words needed to level up
  cooldownSeconds: 5,        // cooldown per word (in-level)
  outOfLevelCooldown: 120,    // cooldown for out-of-level words (seconds)
  outOfLevelEnabled: true,    // enable lightweight trigger for out-of-level words
  detectRange: 2,             // entity proximity range (blocks)
  questIntervalSeconds: 300,  // new quest every N seconds
  questTimeoutSeconds: 300,   // quest expires after N seconds
  voiceEnabled: true,         // TTS audio
  maxLevel: 5,
  playLockTicks: 40,          // 4 seconds playback lock (prevent audio overlap)
};

export const COOLDOWN_TICKS = CONFIG.cooldownSeconds * 20;
export const OUT_OF_LEVEL_COOLDOWN_TICKS = CONFIG.outOfLevelCooldown * 20;
export const DETECT_RANGE = CONFIG.detectRange;
export const QUEST_INTERVAL = CONFIG.questIntervalSeconds * 20;
export const QUEST_TIMEOUT = CONFIG.questTimeoutSeconds * 20;
