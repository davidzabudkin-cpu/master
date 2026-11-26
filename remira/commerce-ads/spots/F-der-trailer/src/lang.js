// Sprache: im Browser aus ?lang=de|en, in Node (tools/dump_cues.mjs) aus VIDEO_LANG. Standard: de.
export const LANG = ((globalThis.location && new URLSearchParams(globalThis.location.search).get('lang')) || globalThis.process?.env?.VIDEO_LANG || 'de').toLowerCase();
export const pick = o => o[LANG] ?? o.de;
