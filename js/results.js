// ===== results.js — Feature 2: renders song cards, loading skeletons, and errors =====

const Results = (() => {
  const grid = () => document.getElementById("results-grid");     // Looked up on demand so load order doesn't matter
  const status = () => document.getElementById("results-status");

  // Shows 6 grey pulsing cards while waiting on the backend
  function showLoading() {
    status().textContent = "Finding your soundtrack...";
    status().classList.remove("error");
    grid().innerHTML = Array(6)
      .fill('<div class="song-card skeleton"><div class="song-art"></div><div class="song-info">&nbsp;</div></div>')
      .join("");
  }

  function showError(message) {
    status().textContent = message;
    status().classList.add("error");                               // Turns the text red
    grid().innerHTML = "";
  }

  // Builds one card. Uses textContent (not innerHTML) for API data so a song title can't inject HTML/scripts.
  function createCard(song) {
    const card = document.createElement("article");
    card.className = "song-card";

    let art;
    if (song.albumArt) {
      art = document.createElement("img");
      art.src = song.albumArt;
      art.alt = `${song.title} album art`;
      art.loading = "lazy";                                        // Only loads images as they scroll into view
    } else {
      art = document.createElement("div");                         // No art → a placeholder square with a note icon
      art.className = "song-art-placeholder";
      art.textContent = "♪";
    }
    art.classList.add("song-art");

    const info = document.createElement("div");
    info.className = "song-info";
    const title = document.createElement("p");
    title.className = "song-title";
    title.textContent = song.title;
    const artist = document.createElement("p");
    artist.className = "song-artist";
    artist.textContent = song.artist;
    info.append(title, artist);

    if (song.reason) {                                             // Optional "why this song" line from Bedrock
      const reason = document.createElement("p");
      reason.className = "song-reason";
      reason.textContent = song.reason;
      info.append(reason);
    }

    const link = document.createElement("a");
    link.className = "song-link";
    link.href = song.spotifyUrl;
    link.target = "_blank";                                        // Opens Spotify in a new tab
    link.rel = "noopener noreferrer";                              // Security: new tab can't control this page
    link.textContent = "Play on Spotify ↗";

    card.append(art, info, link);
    return card;
  }

  // Called with the /recommend response
  function render(mood, data) {
    status().classList.remove("error");
    if (!data.songs || data.songs.length === 0) {
      status().textContent = "No songs found for that one. Try describing it differently.";
      grid().innerHTML = "";
      return;
    }
    status().textContent = `For: "${mood}"`;
    grid().replaceChildren(...data.songs.map(createCard));         // Swaps out skeletons for real cards
  }

  return { showLoading, showError, render };
})();
