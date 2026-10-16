# SONICALLY (MBSR Web App)

Mood-based song recommendations. Describe how you feel, get a soundtrack. Built with plain HTML/CSS/JS and deployed by CodePipeline (Source → Deploy) to S3 + CloudFront.

## Features

| # | Feature | HTML section | Files |
|---|---------|--------------|-------|
| 1 | Mood search bar + quick-pick chips | `#search-section` | `css/search.css`, `js/search.js` |
| 2 | Song result cards | `#results-section` | `css/results.css`, `js/results.js` |
| 3 | Weekly vibe chart | `#vibe-section` | `css/vibe.css`, `js/vibe.js` |
| 4 | Corner chatbot (builds the taste profile) | `#chat-panel` | `css/chatbot.css`, `js/chatbot.js` |

Shared: `css/base.css` (colors and layout), `js/config.js` (API URL and mock switch), `js/storage.js` (anonymous ID and profile), `js/api.js` (all backend calls), `js/mock.js` (fake data), `js/main.js` (startup).

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

`USE_MOCK: true` in `js/config.js` means every feature works with fake data, with no backend needed. When the AWS team gives you the API Gateway URL, paste it into `API_BASE_URL` and set `USE_MOCK: false`.

## Folder structure

```
SONICALLY/
├── index.html              # Page markup for all 4 features
├── css/
│   ├── base.css            # Design tokens, header/footer, shared classes
│   ├── search.css          # Feature 1
│   ├── results.css         # Feature 2
│   ├── vibe.css            # Feature 3
│   └── chatbot.css         # Feature 4
├── js/
│   ├── config.js           # API URL, mock switch, limits
│   ├── storage.js          # localStorage: userId + taste profile
│   ├── mock.js             # Fake API responses (same shapes as the real API)
│   ├── api.js              # The ONLY file that calls fetch()
│   ├── search.js           # Feature 1
│   ├── results.js          # Feature 2
│   ├── vibe.js             # Feature 3
│   ├── chatbot.js          # Feature 4
│   └── main.js             # Boots every feature
├── docs/
│   └── api-contract.md     # Request/response shapes agreed with the backend team
└── .github/
    ├── CODEOWNERS
    ├── PULL_REQUEST_TEMPLATE.md
    └── ISSUE_TEMPLATE/
```

## Git workflow

- `main` is always deployable. CodePipeline deploys from it, so nobody pushes to it directly.
- Make one branch per task: `feature/<name>`, `fix/<name>`, or `docs/<name>`.
- Open a PR into `main`. It needs one approval from a teammate before merging.
- If you change an API shape, update `docs/api-contract.md`, `js/api.js` and `js/mock.js` in the same PR.

```bash
git checkout main && git pull            # Start from the latest main
git checkout -b feature/vibe-chart       # Your task branch
# ...work...
git add . && git commit -m "Add vibe bar chart"
git push -u origin feature/vibe-chart    # Then open a PR on GitHub
```

## Security rules

- Never commit AWS keys, the Spotify client secret, or `.env` files. Everything in this repo is public in the browser.
- The browser never calls Bedrock or Spotify directly. Every call goes through API Gateway → Lambda.
- API data is rendered with `textContent`, never `innerHTML`, so a song title can't inject scripts.
