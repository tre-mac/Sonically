// ===== api.js — the ONLY file that talks to the backend =====
// If an endpoint changes, update it here and in docs/api-contract.md. Nothing else should call fetch().

const Api = (() => {
  // Shared request helper: adds JSON headers, a timeout, and turns HTTP errors into thrown Errors
  async function request(path, options = {}) {
    const controller = new AbortController();                         // Lets us cancel a hung request
    const timer = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(CONFIG.API_BASE_URL + path, {
        ...options,
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));                // Backend error bodies may not be JSON
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`); // Uses Lambda's {error} message if present
      return data;
    } catch (err) {
      if (err.name === "AbortError") throw new Error("The server took too long. Try again.");
      throw err;
    } finally {
      clearTimeout(timer);                                            // Always clean up the timeout
    }
  }

  // Feature 1+2: mood text (+ taste profile) → songs. Backend also logs the mood for the weekly vibe.
  function recommend(mood) {
    const profile = Storage.getProfile();
    if (CONFIG.USE_MOCK) return Mock.recommend(mood, profile);
    return request("/recommend", {
      method: "POST",
      body: JSON.stringify({ userId: Storage.getUserId(), mood, profile }),
    });
  }

  // Feature 4: chat turn → bot reply + updated taste profile
  function sendChat(message, history) {
    const profile = Storage.getProfile();
    const recent = history.slice(-CONFIG.CHAT_HISTORY_LIMIT);          // Trim history to control Bedrock cost
    if (CONFIG.USE_MOCK) return Mock.chat(message, recent, profile);
    return request("/chat", {
      method: "POST",
      body: JSON.stringify({ userId: Storage.getUserId(), message, history: recent, profile }),
    });
  }

  // Feature 3: this user's last 7 days of mood searches
  function getVibe() {
    if (CONFIG.USE_MOCK) return Mock.vibe();
    return request("/vibe?userId=" + encodeURIComponent(Storage.getUserId()), { method: "GET" });
  }

  return { recommend, sendChat, getVibe };
})();
