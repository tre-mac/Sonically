// ===== search.js — Feature 1: handles the mood search bar and quick-pick chips =====

const Search = (() => {
  let busy = false;                                                // Blocks double-submits while a request runs

  async function runSearch(mood) {
    mood = mood.trim();
    if (!mood || busy) return;                                     // Ignore empty input or spam clicks
    busy = true;
    const btn = document.getElementById("search-btn");
    btn.disabled = true;

    Results.showLoading();
    try {
      const data = await Api.recommend(mood);                      // POST /recommend (or mock)
      Results.render(mood, data);
      document.dispatchEvent(new CustomEvent("mbsr:searched"));    // Tells vibe.js a new mood was logged
    } catch (err) {
      Results.showError(err.message || "Something went wrong. Try again.");
    } finally {
      busy = false;
      btn.disabled = false;
    }
  }

  function init() {
    const form = document.getElementById("search-form");
    const input = document.getElementById("mood-input");

    form.addEventListener("submit", (e) => {
      e.preventDefault();                                          // Stops the page from reloading on submit
      runSearch(input.value);
    });

    // Chip click → fill the input and search immediately
    document.getElementById("mood-chips").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");                      // Event delegation: one listener for all chips
      if (!chip) return;
      input.value = chip.dataset.mood;
      runSearch(chip.dataset.mood);
    });
  }

  return { init, runSearch };
})();
