# MBSR API Contract

This is the agreement between the frontend repo and the AWS backend team. If a shape changes, update this file **in the same PR** as `js/api.js` and `js/mock.js`.

Base URL: the API Gateway invoke URL, set in `js/config.js`.
All requests and responses are JSON. Errors return `{ "error": "message" }` with a 4xx/5xx status.
CORS must allow the CloudFront domain (and `http://localhost:8000` during development).

---

## 1. `POST /recommend`: Mood search → songs (Recommend Lambda)

**Request**
```json
{
  "userId": "uuid-from-localStorage",
  "mood": "late night drive after a long week",
  "profile": { "genres": ["R&B"], "artists": [], "energy": "low-mid", "avoid": ["country"], "contexts": ["driving"] }
}
```
- `mood`: required, 1–200 characters
- `profile`: optional. If it's present, it gets added to the Bedrock prompt.

**Response 200**
```json
{
  "moodTag": "chill",
  "songs": [
    {
      "title": "Song name",
      "artist": "Artist name",
      "albumArt": "https://i.scdn.co/image/...",
      "spotifyUrl": "https://open.spotify.com/track/...",
      "reason": "Short line on why it fits"
    }
  ]
}
```
- `moodTag`: normalized label (happy, chill, focused, hyped, sad, stressed, heartbroken, angry). The backend also writes `{userId, timestamp, moodTag}` to the mood-history table for `/vibe`.
- `reason`: optional

---

## 2. `POST /chat`: Chatbot turn (Chat Lambda)

**Request**
```json
{
  "userId": "uuid",
  "message": "I mostly listen to R&B when I study",
  "history": [ { "role": "user", "text": "..." }, { "role": "assistant", "text": "..." } ],
  "profile": { "genres": [], "artists": [], "energy": "", "avoid": [], "contexts": [] }
}
```
- `message`: required, 1–500 characters
- `history`: the last 6 messages at most (trimmed by the frontend)

**Response 200**
```json
{
  "reply": "Nice! Any artists you keep on repeat?",
  "profile": { "genres": ["R&B"], "artists": [], "energy": "", "avoid": [], "contexts": ["studying"] }
}
```
- `profile`: the full updated profile. The frontend saves it to localStorage and sends it with the next `/recommend` call.

---

## 3. `GET /vibe?userId=<uuid>`: Weekly vibe (Vibe Lambda)

**Response 200**
```json
{
  "days": [ { "date": "Mon", "count": 2, "topMood": "focused" } ],
  "topMoods": ["happy", "stressed", "chill"],
  "summary": "Mostly upbeat this week, with a stressful midweek stretch."
}
```
- `days`: always 7 entries, oldest first. Days with no searches have `count: 0` and `topMood: null`.
- `summary`: optional, one sentence
