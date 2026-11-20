# Dumbbell Workouts

Guided, hands-free dumbbell workout player with a YouTube demo for every move. Four quick questions build a personal plan (or keep the classic Days 1–4); it then learns from how workouts felt, ♥ favorites and moves you skip.

## Run it

```bash
./start.sh
```

Opens http://localhost:8765. In Settings, "Demo videos with" picks Anyone / Women / Men. (Opening `index.html` directly won't play the videos — YouTube needs a real web address.)

## Controls

During a workout: Space pause/play · Space twice quickly (or Enter) next move · ← back · F full screen · M video sound · V try another video · H favorite · X never show this move · Esc quit.
Start page: ◀ ▶ choose · Enter start · ▲ ▼ rounds · P my plan · C calendar · S settings. À la carte: ▲ ▼ area · A browse all moves · R shuffle · S save set · Del delete set. "Pick your own" starts empty so you can hand-pick every move.
After a workout: 1–3 rate how it felt · Y accept the suggested change.

Moves, cues and videos: `data.js` (program days, muscles) and `library.js` (extra moves). Plan generator, difficulty levels and skip tags: `plan.js`.

## Deploy

```bash
./deploy.sh
```

Publishes to Cloudflare Pages at https://dumbworkouts.pages.dev (uploads only the site files).
