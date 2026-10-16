// ===== storage.js — anonymous user ID + taste profile, kept in the browser's localStorage =====

const Storage = (() => {
  const USER_KEY = "mbsr_user_id";     // localStorage key for the anonymous ID
  const PROFILE_KEY = "mbsr_profile";  // localStorage key for the chatbot's taste profile

  // An empty profile, same shape the /chat Lambda returns (see docs/api-contract.md)
  const EMPTY_PROFILE = { genres: [], artists: [], energy: "", avoid: [], contexts: [] };

  // localStorage can throw (private mode, blocked storage), so every access is wrapped
  function safeGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch { /* ignore: app still works, just won't remember */ }
  }

  // Returns a stable random ID for this browser. No login needed; DynamoDB keys mood history on it.
  function getUserId() {
    let id = safeGet(USER_KEY);
    if (!id) {
      id = crypto.randomUUID();        // Built-in browser UUID generator
      safeSet(USER_KEY, id);
    }
    return id;
  }

  function getProfile() {
    try {
      return JSON.parse(safeGet(PROFILE_KEY)) || { ...EMPTY_PROFILE }; // Fall back to empty if nothing saved
    } catch {
      return { ...EMPTY_PROFILE };     // Corrupted JSON → start fresh
    }
  }

  function saveProfile(profile) {
    safeSet(PROFILE_KEY, JSON.stringify(profile));
  }

  // "Reset my profile" button: wipes taste profile AND issues a new user ID (so old mood history is detached)
  function reset() {
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(USER_KEY);
    } catch { /* nothing to clear */ }
  }

  return { getUserId, getProfile, saveProfile, reset }; // Public functions other files can call
})();
