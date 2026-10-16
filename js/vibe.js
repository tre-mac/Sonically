// ===== vibe.js — Feature 3: weekly vibe bar chart from GET /vibe =====

const Vibe = (() => {
  // Maps mood labels to emojis for the chart. Unknown moods get a generic note.
  const MOOD_EMOJI = {
    happy: "😄", chill: "😌", focused: "🎯", hyped: "🔥",
    sad: "😢", stressed: "😣", heartbroken: "💔", angry: "😤",
  };
  const emojiFor = (mood) => MOOD_EMOJI[mood] || (mood ? "🎵" : "");

  function render(data) {
    const chart = document.getElementById("vibe-chart");
    const summary = document.getElementById("vibe-summary");
    const top = document.getElementById("vibe-top");

    const days = data.days || [];
    const max = Math.max(1, ...days.map((d) => d.count));          // Tallest bar = 100%; min 1 avoids divide-by-zero

    // One column per day: emoji on top, bar in the middle, day label underneath
    chart.replaceChildren(...days.map((d) => {
      const col = document.createElement("div");
      col.className = "vibe-day";
      col.title = `${d.date}: ${d.count} search${d.count === 1 ? "" : "es"}`; // Hover tooltip

      const emoji = document.createElement("span");
      emoji.className = "vibe-mood";
      emoji.textContent = emojiFor(d.topMood);

      const bar = document.createElement("div");
      bar.className = "vibe-bar";
      bar.style.height = `${(d.count / max) * 100}%`;              // Bar height relative to the busiest day

      const label = document.createElement("span");
      label.className = "vibe-label";
      label.textContent = d.date;

      col.append(emoji, bar, label);
      return col;
    }));

    summary.textContent = data.summary || "Search a few moods and your week will show up here.";

    // "Top moods" tags under the chart
    top.replaceChildren(...(data.topMoods || []).map((m) => {
      const tag = document.createElement("span");
      tag.className = "vibe-tag";
      tag.textContent = `${emojiFor(m)} ${m}`;
      return tag;
    }));
  }

  async function load() {
    try {
      render(await Api.getVibe());                                 // GET /vibe (or mock)
    } catch {
      document.getElementById("vibe-summary").textContent = "Couldn't load your week right now.";
    }
  }

  function init() {
    document.getElementById("vibe-refresh").addEventListener("click", load);
    document.addEventListener("mbsr:searched", load);              // Auto-refresh after each search
    load();                                                        // Initial load on page open
  }

  return { init, load };
})();
