# EzPic — AI Photo Style Matcher

> Drop a reference photo. Upload your shot. EzPic matches the style instantly.

Built for wildlife and sports photographers who want to replicate a specific editing style without manually dialing in Lightroom.

## How it works

1. **Upload a Reference Photo** — a shot edited exactly the way you want
2. **Upload Your Photo** — the image you want to transform
3. **Claude (Opus)** analyzes both images and writes a detailed photographic style prompt
4. **Gemini Imagen** (`gemini-2.0-flash-preview-image-generation`) applies that style to your photo
5. A **draggable before/after slider** lets you compare the original vs the result, with a one-click download

---

## Setup

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd ezpic
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API keys

```bash
cp .env.example .env
```

Open `.env` and fill in both keys:

| Variable | Where to get it |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/) |
| `VITE_GOOGLE_AI_API_KEY` | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |

> **Security note:** Because this is a client-side Vite app, both keys are bundled into the browser JavaScript. This is fine for local use or personal deployment, but for a public-facing app you should proxy the API calls through a server-side edge function (Vercel API routes, Cloudflare Workers, etc.) to keep the keys secret.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Deploy to Vercel

The repo includes a `vercel.json` that configures the Vite build and SPA rewrites.

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts. Add your environment variables when asked, or set them in the Vercel dashboard under **Settings → Environment Variables**.

### Option B — Git-based deployment

1. Push to GitHub/GitLab/Bitbucket
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add `VITE_ANTHROPIC_API_KEY` and `VITE_GOOGLE_AI_API_KEY` as environment variables
4. Deploy

---

## Tech stack

| Layer | Library |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State | Zustand v5 |
| Animations | Framer Motion v11 |
| Before/After slider | react-compare-slider |
| AI — style analysis | Anthropic SDK → `claude-opus-4-5` |
| AI — image transform | Google Generative AI SDK → `gemini-2.0-flash-preview-image-generation` |

---

## Project structure

```
src/
  components/
    UploadZone.tsx          Drag-drop upload with preview
    BeforeAfterSlider.tsx   react-compare-slider wrapper with labels
    LoadingSteps.tsx        Animated sequential loading steps
    PlanBadge.tsx           Shell badge (future Pro plan)
  pages/
    Home.tsx                Upload UI + transform button
    Results.tsx             Before/after slider + download
  store/
    useAppStore.ts          Zustand store (images, status, prompt)
  lib/
    claude.ts               Claude API call → returns style prompt string
    gemini.ts               Gemini API call → returns base64 image
    pipeline.ts             Orchestrates claude → gemini in sequence
  App.tsx                   Router + loading overlay
  main.tsx                  Entry point
```

---

## Notes

- Supported image formats: JPEG, PNG, WebP, GIF (max 10 MB per image)
- The Gemini model may occasionally decline to generate an image if safety filters are triggered. Try a different photo if this happens.
- Processing typically takes 15–40 seconds total (Claude ~5–10 s, Gemini ~10–25 s)
