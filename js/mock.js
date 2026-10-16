// ===== mock.js — fake backend responses, used only when CONFIG.USE_MOCK is true =====
// Each function returns the SAME shape as the real endpoint in docs/api-contract.md,
// so switching to the real API needs no changes anywhere else.

const Mock = (() => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms)); // Simulates network delay

  const SAMPLE_SONGS = [
    { title: "Sample Song One", artist: "Artist A", reason: "Mellow and steady for winding down" },
    { title: "Sample Song Two", artist: "Artist B", reason: "Upbeat lift without being loud" },
    { title: "Sample Song Three", artist: "Artist C", reason: "Matches the late-night feel" },
    { title: "Sample Song Four", artist: "Artist D", reason: "Lyrics fit what you described" },
    { title: "Sample Song Five", artist: "Artist E", reason: "Similar energy to your favorites" },
    { title: "Sample Song Six", artist: "Artist F", reason: "A slower closer" },
  ];

  // Mirrors POST /recommend
  async function recommend(mood) {
    await wait(800);
    return {
      moodTag: "chill",                    // Normalized mood label Bedrock would return
      songs: SAMPLE_SONGS.map((s) => ({
        ...s,
        albumArt: "",                      // Empty → results.js shows a placeholder square
        spotifyUrl: "https://open.spotify.com/search/" + encodeURIComponent(s.title),
      })),
    };
  }

  // Mirrors POST /chat — echoes back and pretends to learn a genre
  async function chat(message, history, profile) {
    await wait(700);
    const updated = { ...profile };
    if (/r&b|rnb/i.test(message) && !updated.genres.includes("R&B")) {
      updated.genres = [...updated.genres, "R&B"]; // Tiny fake "learning" so you can test profile saving
    }
    return {
      reply: "Nice! (mock reply) What do you usually play when you're working out?",
      profile: updated,
    };
  }

  // Mirrors GET /vibe
  async function vibe() {
    await wait(500);
    return {
      days: [
        { date: "Mon", count: 2, topMood: "focused" },
        { date: "Tue", count: 0, topMood: null },
        { date: "Wed", count: 4, topMood: "stressed" },
        { date: "Thu", count: 1, topMood: "chill" },
        { date: "Fri", count: 3, topMood: "hyped" },
        { date: "Sat", count: 5, topMood: "happy" },
        { date: "Sun", count: 1, topMood: "chill" },
      ],
      topMoods: ["happy", "stressed", "chill"],
      summary: "Mostly upbeat this week, with a stressful midweek stretch.",
    };
  }

  return { recommend, chat, vibe };
})();
