# Dumbbell Workouts

Guided, hands-free player for our 4-day beginner dumbbell program, with a YouTube demo for every move.

## Run it

```bash
./start.sh
```

Opens http://localhost:8765. (Opening `index.html` directly won't play the videos — YouTube needs a real web address.)

## Controls

Space pause/play · Enter done → next · ← back · F full screen · M video sound · V try another video · Esc quit.
On the start page: 1–4 starts that day, Enter starts the suggested one.

Workouts, reps, cues and video picks live in `data.js`. Each move has a main video and two backups; "change video" on the start page lets you paste your own link.

## Deploy

```bash
./deploy.sh
```

Publishes to Cloudflare Pages at https://dumbworkouts.pages.dev (uploads only the four site files).
