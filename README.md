# Lumen Frontier

> Two ways to explore what you know: a drag-and-drop widget OS, and a galaxy of subjects you fly through as an astronaut.

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=flat&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=three.js&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-38BDF8?style=flat&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Status](https://img.shields.io/badge/status-prototype-e99218?style=flat)
[![Portfolio](https://img.shields.io/badge/portfolio-pablomanjarres.com-c8542a?style=flat)](https://pablomanjarres.com/portfolio/projects/lumen-frontier)

Lumen Frontier is the front-end of the Lumen learning project, built to make studying feel like a place instead of a form. One landing page splits into two very different interfaces, and you pick how you want to move through your own knowledge.

## The two experiences

**LumenOS** — a desktop-style dashboard. Every study tool is a widget you drag by its header, resize from the corner, and arrange on an open canvas. Add more from a categorized widget marketplace, drop in a custom background, flip into edit mode, and the whole layout is saved to your browser so it returns exactly how you left it.

**Lumenverse** — a first-person 3D space, hand-built in Three.js. Each academic subject is a glowing planet. You fly toward them as a tethered astronaut with visible gloves, a helmet visor, and a HUD, using mouse-look and WASD, then trigger a rocket fly-to animation to travel across the system.

## Highlights

- **13 working widgets**, registry-driven — notes, tasks, pomodoro, goals, journal, music, ambient sounds, stats, flashcards, analytics, progress, time tracker, quick access. Each is lazy-loaded into its own chunk with `React.lazy` + `Suspense`.
- **Real direct-manipulation** via custom `useDrag` / `useResize` hooks, with per-widget min/max size constraints and a localStorage layer that migrates older saved layouts on load.
- **A 985-line Three.js scene**: astronaut POV, tethered spaceship, 18 planets with layered atmospheric glow, pointer-lock mouse-look, WASD flight, and a fullscreen immersive mode.
- **Performance-minded WebGL**: capped pixel ratio, simplified geometry, shadows off, a trimmed 1,000-star field, and Vite manual chunks splitting `three` from the React vendor bundle.
- **Astro islands** everywhere — static by default, React only where it needs to be interactive, `nanostores` as the shared state bus between islands.

## How it works

Astro renders the static shell and routes. The dashboard mounts as a `client:only` React island; the 3D scene mounts `client:load`. State that crosses islands lives in `nanostores` atoms and syncs down to `localStorage`.

```
apps/frontend/src/
├─ pages/                    index · dashboard · lumenverse  (Astro routes)
├─ features/
│  ├─ lumen-os/dashboard/    widget canvas, registry, marketplace, edit mode
│  │  ├─ widgets/            notes · tasks · pomodoro · music · journal … (13)
│  │  ├─ components/         widget-system (container · header · renderer · resize)
│  │  ├─ hooks/              useDrag · useResize
│  │  └─ stores/             nanostores atoms → localStorage
│  └─ lumenverse/            planetary-scene/  (985-line Three.js explorer)
└─ layouts/                  Landing · Fullscreen · base
apps/backend/                FastAPI scaffold — auth + sync, under development
api/index.py                 Vercel serverless handler (Mangum → FastAPI)
```

The `apps/backend` FastAPI service and the `api/` serverless handler are scaffolded for future authentication and cross-device sync. They are excluded from the Vercel build today (`.vercelignore`); the app runs fully client-side.

## Tech stack

Astro 4 (static output) · React 18 islands · TypeScript 5 · Three.js r180 · Tailwind CSS 3 · nanostores · Vite · npm workspaces · Vercel static adapter. FastAPI and Supabase are scaffolded on the backend side but not yet implemented.

## Getting started

```bash
git clone https://github.com/pablomanjarres/Lumen-Frontier.git
cd Lumen-Frontier
npm install
npm run dev:frontend   # http://localhost:3000
```

Build the static site:

```bash
npm run build:frontend
```

The frontend runs with no secrets. The one env var only matters once the backend exists:

```bash
# apps/frontend/.env
PUBLIC_API_URL=http://localhost:8000
```

---

Part of the [Lumen](https://github.com/pablomanjarres) learning project. More at [pablomanjarres.com/portfolio/projects/lumen-frontier](https://pablomanjarres.com/portfolio/projects/lumen-frontier).