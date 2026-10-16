// ===== config.js — the only place environment settings live =====

const CONFIG = {
  API_BASE_URL: "https://REPLACE_ME.execute-api.us-east-1.amazonaws.com/prod", // API Gateway invoke URL (from the backend team)
  USE_MOCK: true,          // true = fake data from mock.js, so the frontend works before the backend exists. Flip to false once API is live.
  REQUEST_TIMEOUT_MS: 15000, // Abort requests that hang longer than 15s (Bedrock can be slow, but not that slow)
  CHAT_HISTORY_LIMIT: 6,   // Only send the last 6 messages to /chat (keeps Bedrock token cost down)
};

// Note: never put AWS keys or the Spotify secret here. Everything in this repo is public in the browser.
