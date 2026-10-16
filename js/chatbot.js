// ===== chatbot.js — Feature 4: corner chat widget that builds the user's taste profile =====

const Chatbot = (() => {
  const history = [];                                              // [{role: "user"|"assistant", text}] for this page session
  let busy = false;

  const panel = () => document.getElementById("chat-panel");
  const messages = () => document.getElementById("chat-messages");

  // Adds a bubble. textContent keeps bot/user text from being run as HTML.
  function addMessage(role, text, extraClass = "") {
    const div = document.createElement("div");
    div.className = `msg ${role === "user" ? "user" : "bot"} ${extraClass}`.trim();
    div.textContent = text;
    messages().append(div);
    messages().scrollTop = messages().scrollHeight;                // Auto-scroll to newest message
    return div;
  }

  function open() {
    panel().hidden = false;
    document.getElementById("chat-toggle").setAttribute("aria-expanded", "true");
    if (history.length === 0 && messages().children.length === 0) {  // Greet only on first open
      addMessage("assistant", "Hey! I'm your music buddy. What kind of music have you been into lately?");
    }
    document.getElementById("chat-input").focus();
  }

  function close() {
    panel().hidden = true;
    document.getElementById("chat-toggle").setAttribute("aria-expanded", "false");
  }

  async function send(text) {
    text = text.trim();
    if (!text || busy) return;
    busy = true;

    addMessage("user", text);
    const typing = addMessage("assistant", "...", "typing");        // Temporary "typing" bubble

    try {
      const data = await Api.sendChat(text, history);              // POST /chat (or mock)
      typing.remove();
      addMessage("assistant", data.reply);
      history.push({ role: "user", text }, { role: "assistant", text: data.reply }); // Save turn after success only
      if (data.profile) Storage.saveProfile(data.profile);         // Updated taste profile → used by next /recommend call
    } catch (err) {
      typing.remove();
      addMessage("assistant", "Sorry, I couldn't reach the server. Try again in a sec.");
    } finally {
      busy = false;
    }
  }

  function init() {
    document.getElementById("chat-toggle").addEventListener("click", () =>
      panel().hidden ? open() : close()                            // Toggle open/closed
    );
    document.getElementById("chat-close").addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !panel().hidden) close();          // Esc closes the panel
    });

    const form = document.getElementById("chat-form");
    const input = document.getElementById("chat-input");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      send(input.value);
      input.value = "";                                            // Clear box right away for a snappy feel
    });
  }

  // Used by the "Reset my profile" button
  function clear() {
    history.length = 0;
    messages().innerHTML = "";
  }

  return { init, clear };
})();
