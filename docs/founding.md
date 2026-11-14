# Dumbbell Workouts — founding doc

**What it is:** a single-page website that turns our 4-day beginner dumbbell program (8 lb dumbbells, no bench) into a hands-free guided session on the computer.

**Who it's for:** two people working out together after work, standing a few feet from the screen.

**What it does**
- Pick Day 1–4 (it suggests the next day in the rotation) and 1, 2 or 3 rounds.
- Plays a short YouTube demo of each exercise, embedded and looping, muted by default.
- Shows the move name, reps, how many dumbbells, and form cues in big type.
- Rest countdowns between moves (showing the next move's video), 30-second timers per side for timed moves, beeps at 3-2-1.
- Keyboard: Space pause/play, Enter done → next, ← back, F full screen, M sound, V other video, Esc quit.
- Remembers settings and which day was done last (browser storage only).

**What it won't do:** accounts, syncing, tracking weights or reps, social features.

**What proving the core taught us**
- YouTube embeds don't work from a file opened directly (file://); the site must be served from a real address (`./start.sh` → http://localhost:8765).
- Clicking an embedded video steals keyboard focus, so a transparent layer sits over the video and clicks there pause/play instead.
- Every chosen video was checked as embeddable; each move has 2 backups (V cycles) and a "change video" link to paste your own.
