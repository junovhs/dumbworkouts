# Dumbbell Workouts

Guided, hands-free dumbbell workout player with a YouTube demo for every move. Four quick questions build a personal plan (or keep the classic Days 1–4); it then learns from how workouts felt, ♥ favorites and moves you skip.

## Show it off

Send people **https://dumbworkouts.pages.dev/?demo**. It opens with 8 weeks of made-up workouts, a plan, favorites and a saved set, so the calendar and plan look lived-in. Demo data is kept separately (`demo:` keys) and reset on every visit, so it never touches real progress.

First-time visitors on the normal link get a welcome screen with four tiles (try a workout, build a plan, build a workout, progress) instead of being dropped into the plan wizard. Tour on the start page shows it again.

## Run it

```bash
./start.sh
```

Opens http://localhost:8765. In Settings, "Demo videos with" picks Anyone / Women / Men. (Opening `index.html` directly won't play the videos — YouTube needs a real web address.)

## Controls

During a workout: Space pause/play · Space twice quickly (or Enter) next move · ← back · F full screen · M video sound · V try another video · H favorite · X never show this move · Esc quit.
Home: Build a workout, My Plan (this week's days, framed together, with a ✓ on each day done this week, and Edit plan), then any workouts pinned from the builder. Both the builder and the plan have a Coverage slider: drag it right and the fewest extra moves are added to work more of the body; drag it left for fewer moves, big muscles first. Coverage counts a muscle as fully worked once it gets one main-muscle move (or about three where it only helps), so lightly touched muscles show as such. Arrow keys, Enter and Esc work for navigating; workout keys are listed in Settings.
After a workout: 1–3 rate how it felt · Y accept the suggested change.

Moves, cues and videos: `src/data.ts` (program days) and `src/library.ts` (extra moves). Muscles: `src/muscles.ts` holds the 30 prime movers, 8 stabilizer groups, every move's muscle tags and the coverage math. Plan generator, difficulty levels and skip tags: `src/plan.ts`.

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
