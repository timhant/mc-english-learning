// config.js - Runtime configuration
// BDS script modules cannot read files at runtime, so config is hardcoded here.
// To change settings, edit these values and restart the server.

export const CONFIG = {
  unlockThreshold: 0.8,    // % of words needed to level up
  cooldownSeconds: 60,     // cooldown per word
  detectRange: 2,          // entity proximity range (blocks)
  questIntervalSeconds: 300, // new quest every N seconds
  questTimeoutSeconds: 300,  // quest expires after N seconds
  voiceEnabled: false,     // TTS audio (Phase 2)
  maxLevel: 5,
};

export const COOLDOWN_TICKS = CONFIG.cooldownSeconds * 20;
export const DETECT_RANGE = CONFIG.detectRange;
export const QUEST_INTERVAL = CONFIG.questIntervalSeconds * 20;
export const QUEST_TIMEOUT = CONFIG.questTimeoutSeconds * 20;
