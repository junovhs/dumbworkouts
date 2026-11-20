# Dumbbell Workouts

Guided, hands-free dumbbell workout player with a YouTube demo for every move. Four quick questions build a personal plan (or keep the classic Days 1–4); it then learns from how workouts felt, ♥ favorites and moves you skip.

## Show it off

Send people **https://dumbworkouts.pages.dev/?demo**. It opens with 8 weeks of made-up workouts, a plan, favorites and a saved set, so the calendar and plan look lived-in. Demo data is kept separately (`demo:` keys) and reset on every visit, so it never touches real progress.

First-time visitors on the normal link get a welcome screen with four tiles (try a workout, build a plan, à la carte, progress) instead of being dropped into the plan wizard. Press `?` or Tour on the start page to see it again.

## Run it

```bash
./start.sh
```

Opens http://localhost:8765. In Settings, "Demo videos with" picks Anyone / Women / Men. (Opening `index.html` directly won't play the videos — YouTube needs a real web address.)

## Controls

During a workout: Space pause/play · Space twice quickly (or Enter) next move · ← back · F full screen · M video sound · V try another video · H favorite · X never show this move · Esc quit.
Start page: ◀ ▶ choose · Enter start · ▲ ▼ rounds · P my plan · C calendar · S settings. À la carte: ▲ ▼ area · A browse all moves · R shuffle · S save set · Del delete set. "Pick your own" starts empty so you can hand-pick every move.
After a workout: 1–3 rate how it felt · Y accept the suggested change.

Moves, cues and videos: `src/data.ts` (program days, muscles) and `src/library.ts` (extra moves). Plan generator, difficulty levels and skip tags: `src/plan.ts`.

## TypeScript

The source lives in `src/` and is compiled into the ignored `dist/` folder. Browsers receive compiled JavaScript in the same script order as before.

```bash
npm install
npm run typecheck
npm run build
```

`./start.sh` builds and serves `dist/`; `./deploy.sh` builds and deploys `dist/`.

## Deploy

```bash
./deploy.sh
```

Publishes to Cloudflare Pages at https://dumbworkouts.pages.dev (uploads only the site files).
