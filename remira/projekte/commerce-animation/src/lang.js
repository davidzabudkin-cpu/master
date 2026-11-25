// Sprache des Videos: im Browser aus der URL (?lang=en), in Node (tools/dump_cues.mjs) aus VIDEO_LANG. Standard: en.
export const LANG = ((globalThis.location && new URLSearchParams(globalThis.location.search).get('lang')) || globalThis.process?.env?.VIDEO_LANG || 'en').toLowerCase();
export const pick = o => o[LANG] ?? o.en;
