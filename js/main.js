// ===== main.js — starts every feature once the page has loaded =====

document.addEventListener("DOMContentLoaded", () => {
  Search.init();   // Feature 1 (+ Feature 2 renders through Results)
  Vibe.init();     // Feature 3
  Chatbot.init();  // Feature 4

  // Privacy control: wipes the local taste profile + anonymous ID, clears the chat
  document.getElementById("reset-profile").addEventListener("click", () => {
    if (!confirm("Reset your taste profile and start fresh?")) return; // Confirm before deleting
    Storage.reset();
    Chatbot.clear();
    Vibe.load();   // New userId → empty week
  });

  if (CONFIG.USE_MOCK) console.info("[MBSR] Running with mock data. Set USE_MOCK=false in js/config.js to use the real API.");
});
