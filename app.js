/* Dumbbell Workouts — guided player. No build step, no dependencies besides the YouTube IFrame API. */
(() => {
  const $ = (id) => document.getElementById(id);
  const EX = window.EXERCISES, DAYS = window.DAYS;

  // ---------- persisted settings ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const settings = {
    rounds: store.get("rounds", 1),
    rest: store.get("rest", 30),
    beeps: store.get("beeps", true),
    sound: store.get("sound", false),
  };
  const save = (k) => store.set(k, settings[k]);

  const READY_SECS = 10;      // "get ready" before the first move
  const ROUND_REST = 60;      // rest between rounds

  // ---------- video choice per exercise ----------
  function videoOptions(key) {
    const e = EX[key];
    const custom = store.get("custom:" + key, null);
    return (custom ? [custom] : []).concat([e.video], e.alts || []);
  }
  function currentVideo(key) {
    const opts = videoOptions(key);
    return opts[store.get("vidx:" + key, 0) % opts.length];
  }
  function nextVideo(key) {
    const opts = videoOptions(key);
    store.set("vidx:" + key, (store.get("vidx:" + key, 0) + 1) % opts.length);
  }
  function parseYouTube(url) {
    const m = String(url).match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/) ||
              String(url).trim().match(/^([A-Za-z0-9_-]{11})$/);
    if (!m) return null;
    return { id: m[1], shape: /shorts/.test(url) ? "tall" : "wide" };
  }

  // ---------- history ----------
  const history = () => store.get("history", []);
  function suggestedDay() {
    const h = history();
    return h.length ? (h[h.length - 1].day % DAYS.length) + 1 : 1;
  }
  function fmtDate(iso) {
    const d = new Date(iso), today = new Date();
    const days = Math.round((new Date(today.toDateString()) - new Date(d.toDateString())) / 864e5);
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }

  // ---------- views ----------
  let view = "home";
  function show(v) {
    view = v;
    for (const id of ["home", "session", "done"]) $(id).classList.toggle("hidden", id !== v);
  }

  // ---------- HOME ----------
  function segmented(el, options, value, onPick) {
    el.innerHTML = "";
    for (const [val, label] of options) {
      const b = document.createElement("button");
      b.textContent = label;
      b.className = val === value ? "on" : "";
      b.onclick = () => { onPick(val); };
      el.appendChild(b);
    }
  }
  function dumbbellText(n) { return n === 0 ? "No weight" : n === 1 ? "1 dumbbell" : "2 dumbbells"; }
  function minutesFor(r) { return ["", "9–10 min", "14–15 min", "18–20 min"][r] || ""; }

  function renderHome() {
    segmented($("roundsSeg"), [[1, "1"], [2, "2"], [3, "3"]], settings.rounds, (v) => { settings.rounds = v; save("rounds"); renderHome(); });
    $("roundsHint").textContent = `≈ ${minutesFor(settings.rounds)}`;
    segmented($("restSeg"), [[20, "20s"], [30, "30s"], [45, "45s"], [0, "None"]], settings.rest, (v) => { settings.rest = v; save("rest"); renderHome(); });
    segmented($("beepSeg"), [[true, "On"], [false, "Off"]], settings.beeps, (v) => { settings.beeps = v; save("beeps"); renderHome(); });

    const h = history(), sug = suggestedDay();
    $("lastDone").innerHTML = h.length
      ? `Last workout: <b>Day ${h[h.length - 1].day}</b> (${h[h.length - 1].rounds} round${h[h.length - 1].rounds > 1 ? "s" : ""}), ${fmtDate(h[h.length - 1].date)}. Up next: <b>Day ${sug}</b>.`
      : `Start with <b>Day 1</b>, then rotate through Day 1 → 4.`;

    const wrap = $("days");
    wrap.innerHTML = "";
    for (const d of DAYS) {
      const card = document.createElement("article");
      card.className = "day" + (d.n === sug ? " suggested" : "");
      card.style.setProperty("--c", d.color);
      const last = [...h].reverse().find((x) => x.day === d.n);
      card.innerHTML = `
        ${d.n === sug ? '<div class="up-next">UP NEXT</div>' : ""}
        <div class="day-num">DAY ${d.n}</div>
        <h3>${d.title}</h3>
        <p class="focus">${d.focus}</p>
        <ol class="move-list">${d.moves.map((k) => `
          <li>
            <span class="mv-name">${EX[k].name}</span>
            <span class="mv-reps">${EX[k].reps}</span>
            <span class="mv-db">${dumbbellText(EX[k].dumbbells)}</span>
            <button class="link" data-k="${k}" title="Paste your own YouTube link for this move">change video</button>
          </li>`).join("")}
        </ol>
        <div class="day-foot">
          <span class="muted">${last ? "Last done " + fmtDate(last.date) : "Not done yet"}</span>
          <button class="start-btn">▶ Start Day ${d.n} <kbd>${d.n}</kbd></button>
        </div>`;
      card.querySelector(".start-btn").onclick = () => startSession(d.n);
      card.querySelectorAll("button.link").forEach((b) => (b.onclick = () => customVideo(b.dataset.k)));
      wrap.appendChild(card);
    }
    $("rules").innerHTML = `<h2>Quick rules</h2><ul>${window.RULES.map((r) => `<li>${r}</li>`).join("")}</ul>`;
  }

  function customVideo(key) {
    const cur = currentVideo(key);
    const url = prompt(`Paste a YouTube link for "${EX[key].name}".\n(Leave empty to go back to the built-in video.)`, `https://youtu.be/${cur.id}`);
    if (url === null) return;
    if (url.trim() === "") { store.set("custom:" + key, null); store.set("vidx:" + key, 0); return; }
    const v = parseYouTube(url);
    if (!v) return alert("That doesn't look like a YouTube link.");
    store.set("custom:" + key, v);
    store.set("vidx:" + key, 0);
  }

  // ---------- SESSION ----------
  let S = null; // session state
  function buildSteps(day, rounds) {
    const moves = day.moves, steps = [];
    steps.push({ type: "rest", label: "Get ready!", secs: READY_SECS, next: moves[0], round: 1, idx: 0 });
    for (let r = 1; r <= rounds; r++) {
      moves.forEach((k, i) => {
        steps.push({ type: "work", key: k, round: r, idx: i });
        const lastMove = i === moves.length - 1, lastRound = r === rounds;
        if (lastMove && lastRound) return;
        if (lastMove) steps.push({ type: "rest", label: `Round ${r} done! Rest`, secs: Math.max(settings.rest, ROUND_REST), next: moves[0], round: r + 1, idx: 0 });
        else if (settings.rest > 0) steps.push({ type: "rest", label: "Rest", secs: settings.rest, next: moves[i + 1], round: r, idx: i + 1 });
      });
    }
    return steps;
  }

  function startSession(n) {
    const day = DAYS.find((d) => d.n === n);
    unlockAudio();
    S = { day, rounds: settings.rounds, steps: buildSteps(day, settings.rounds), i: 0, paused: false, started: Date.now() };
    document.documentElement.style.setProperty("--accent", day.color);
    show("session");
    requestWakeLock();
    renderProgress();
    enterStep(0);
  }

  function enterStep(i) {
    S.i = Math.max(0, Math.min(i, S.steps.length - 1));
    const st = S.steps[S.i];
    S.paused = false;
    S.stepStart = Date.now();
    S.pausedAccum = 0;
    if (st.type === "rest") {
      S.remaining = st.secs;
    } else if (EX[st.key].timed) {
      S.remaining = EX[st.key].timed.seconds;
      S.side = 0;
    } else {
      S.remaining = null;
    }
    S.lastBeepSec = null;
    renderStep();
    loadVideoFor(st.type === "rest" ? st.next : st.key);
  }

  function renderProgress() {
    const p = $("progress");
    p.innerHTML = "";
    S.steps.forEach((st, j) => {
      if (st.type !== "work") return;
      const dot = document.createElement("span");
      dot.className = "dot";
      dot.dataset.j = j;
      dot.title = `Round ${st.round}: ${EX[st.key].name}`;
      p.appendChild(dot);
    });
  }

  function renderStep() {
    const st = S.steps[S.i];
    const isRest = st.type === "rest";
    const key = isRest ? st.next : st.key;
    const e = EX[key];
    $("session").classList.toggle("resting", isRest);
    $("tDay").textContent = `Day ${S.day.n} · ${S.day.title}`;
    $("tRound").textContent = `Round ${st.round} of ${S.rounds}`;
    $("tMove").textContent = `Move ${st.idx + 1} of ${S.day.moves.length}`;
    $("phase").textContent = isRest ? `${st.label} · up next` : "Now";
    $("exName").textContent = e.name;
    $("exReps").textContent = e.reps;
    $("badges").innerHTML = `<span class="badge db">${dumbbellText(e.dumbbells)}</span>` + e.muscles.map((m) => `<span class="badge">${m}</span>`).join("");
    $("cues").innerHTML = e.cues.map((c) => `<li>${c}</li>`).join("");
    $("tip").classList.toggle("hidden", !e.tip);
    $("tip").textContent = e.tip ? "★ " + e.tip : "";
    $("nextTxt").textContent = isRest ? "Skip rest" : S.i === S.steps.length - 1 ? "Finish!" : "Done – Next";
    document.querySelectorAll("#progress .dot").forEach((d) => {
      const j = +d.dataset.j;
      d.className = "dot" + (j < S.i ? " done" : j === S.i ? " now" : "");
    });
    renderTimer();
    renderPause();
  }

  function fmt(secs) {
    secs = Math.max(0, Math.ceil(secs));
    const m = Math.floor(secs / 60), s = secs % 60;
    return m ? `${m}:${String(s).padStart(2, "0")}` : String(s);
  }

  function renderTimer() {
    const st = S.steps[S.i];
    const t = $("bigTimer"), side = $("sideLabel");
    const timed = st.type === "work" && EX[st.key].timed;
    if (st.type === "rest" || timed) {
      t.classList.remove("hidden");
      t.textContent = fmt(S.remaining);
      t.classList.toggle("warn", S.remaining <= 3.05);
    } else t.classList.add("hidden");
    if (timed) {
      side.classList.remove("hidden");
      const sides = EX[st.key].timed.sides;
      side.textContent = `Side ${S.side + 1} of ${sides.length}: ${sides[S.side]}`;
    } else side.classList.add("hidden");
    const el = Math.floor((Date.now() - S.started) / 1000);
    $("elapsed").textContent = `Workout time ${Math.floor(el / 60)}:${String(el % 60).padStart(2, "0")}`;
  }

  function renderPause() {
    $("pausedBadge").classList.toggle("hidden", !S.paused);
    $("pauseIc").textContent = S.paused ? "▶" : "❚❚";
    $("pauseTxt").textContent = S.paused ? "Play" : "Pause";
    $("session").classList.toggle("is-paused", S.paused);
  }

  let lastTick = performance.now();
  function tick(now) {
    const dt = (now - lastTick) / 1000;
    lastTick = now;
    if (view === "session" && S) {
      if (!S.paused && S.remaining !== null) {
        S.remaining -= dt;
        const whole = Math.ceil(S.remaining);
        if (whole <= 3 && whole >= 1 && whole !== S.lastBeepSec) { S.lastBeepSec = whole; beep(660, 0.12); }
        if (S.remaining <= 0) timerDone();
      }
      renderTimer();
    }
    requestAnimationFrame(tick);
  }

  function timerDone() {
    const st = S.steps[S.i];
    beep(990, 0.35);
    if (st.type === "work" && EX[st.key].timed && S.side < EX[st.key].timed.sides.length - 1) {
      S.side++;
      S.remaining = EX[st.key].timed.seconds;
      S.lastBeepSec = null;
      flash("SWITCH SIDES");
      return;
    }
    next();
  }

  function next() {
    if (S.i >= S.steps.length - 1) return finish();
    enterStep(S.i + 1);
  }
  function back() {
    // go to the previous exercise (skip back over rests)
    let j = S.i - 1;
    while (j > 0 && S.steps[j].type === "rest") j--;
    enterStep(Math.max(0, j));
  }
  function togglePause() {
    S.paused = !S.paused;
    renderPause();
    if (player && playerReady) S.paused ? player.pauseVideo() : player.playVideo();
  }
  function quit() {
    if (!confirm("Quit this workout?")) return;
    endSession();
    show("home");
    renderHome();
  }
  function endSession() {
    if (player && playerReady) player.stopVideo();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    releaseWakeLock();
  }
  function finish() {
    const h = history();
    h.push({ day: S.day.n, rounds: S.rounds, date: new Date().toISOString(), minutes: Math.round((Date.now() - S.started) / 60000) });
    store.set("history", h.slice(-200));
    beep(523, 0.15); setTimeout(() => beep(659, 0.15), 160); setTimeout(() => beep(784, 0.3), 320);
    endSession();
    $("doneTitle").textContent = `Day ${S.day.n} done! 🎉`;
    const mins = Math.max(1, Math.round((Date.now() - S.started) / 60000));
    $("doneSub").textContent = `${S.rounds} round${S.rounds > 1 ? "s" : ""} of ${S.day.title} in about ${mins} minute${mins > 1 ? "s" : ""}.`;
    $("doneNext").textContent = `Next time: Day ${suggestedDay()} — ${DAYS[suggestedDay() - 1].title}`;
    show("done");
  }

  function flash(text) {
    const f = document.createElement("div");
    f.className = "flash";
    f.textContent = text;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1600);
  }

  // ---------- YouTube player ----------
  let player = null, playerReady = false, pendingVideo = null;
  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player("player", {
      host: "https://www.youtube-nocookie.com",
      playerVars: { autoplay: 1, mute: 1, controls: 0, rel: 0, playsinline: 1, modestbranding: 1, iv_load_policy: 3, disablekb: 1, fs: 0 },
      events: {
        onReady: () => {
          playerReady = true;
          applySound();
          if (pendingVideo) { const v = pendingVideo; pendingVideo = null; playVideo(v); }
        },
        onStateChange: (ev) => {
          if (ev.data === YT.PlayerState.ENDED) { player.seekTo(0, true); if (!S || !S.paused) player.playVideo(); }
          if (ev.data === YT.PlayerState.PLAYING) $("videoError").classList.add("hidden");
        },
        onError: () => $("videoError").classList.remove("hidden"),
      },
    });
  };

  let currentKey = null;
  function loadVideoFor(key) {
    currentKey = key;
    const v = currentVideo(key);
    $("videoBox").className = "video-box " + (v.shape === "tall" ? "tall" : "wide");
    $("videoError").classList.add("hidden");
    if (!playerReady) { pendingVideo = v; return; }
    playVideo(v);
  }
  function playVideo(v) {
    if (S && S.paused) player.cueVideoById(v.id);
    else player.loadVideoById(v.id);
  }
  function applySound() {
    $("soundIc").textContent = settings.sound ? "🔊" : "🔇";
    if (!playerReady) return;
    if (settings.sound) { player.unMute(); player.setVolume(80); } else player.mute();
  }
  function toggleSound() { settings.sound = !settings.sound; save("sound"); applySound(); }
  function otherVideo() {
    if (!currentKey) return;
    nextVideo(currentKey);
    loadVideoFor(currentKey);
    const opts = videoOptions(currentKey);
    flash(`Video ${(store.get("vidx:" + currentKey, 0) % opts.length) + 1} of ${opts.length}`);
  }

  // ---------- fullscreen / wake lock / audio ----------
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
  }
  let wakeLock = null;
  async function requestWakeLock() { try { wakeLock = await navigator.wakeLock?.request("screen"); } catch {} }
  function releaseWakeLock() { try { wakeLock?.release(); } catch {} wakeLock = null; }
  document.addEventListener("visibilitychange", () => { if (view === "session" && document.visibilityState === "visible") requestWakeLock(); });

  let actx = null;
  function unlockAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); } catch {} }
  function beep(freq, dur) {
    if (!settings.beeps || !actx) return;
    const o = actx.createOscillator(), g = actx.createGain();
    o.frequency.value = freq; o.type = "sine";
    g.gain.setValueAtTime(0.0001, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.35, actx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.connect(g).connect(actx.destination);
    o.start(); o.stop(actx.currentTime + dur + 0.02);
  }

  // ---------- input ----------
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (view === "home") {
      if (/^[1-4]$/.test(k)) { e.preventDefault(); startSession(+k); }
      else if (k === "Enter") { e.preventDefault(); startSession(suggestedDay()); }
      return;
    }
    if (view === "done") {
      if (k === "Enter" || k === "Escape" || k === " ") { e.preventDefault(); show("home"); renderHome(); }
      return;
    }
    // session
    const map = {
      " ": togglePause, Enter: next, ArrowRight: next, ArrowLeft: back, Backspace: back,
      f: toggleFullscreen, F: toggleFullscreen, m: toggleSound, M: toggleSound, v: otherVideo, V: otherVideo, Escape: quit,
    };
    if (map[k]) {
      e.preventDefault();
      // first Escape while fullscreen is eaten by the browser; that's fine.
      map[k]();
    }
  });
  // Keep keyboard focus out of buttons so Space/Enter always go to our handler.
  document.addEventListener("click", (e) => { if (e.target.closest("button")) e.target.closest("button").blur(); });

  $("shield").onclick = togglePause;
  $("pauseBtn").onclick = togglePause;
  $("nextBtn").onclick = next;
  $("backBtn").onclick = back;
  $("soundBtn").onclick = toggleSound;
  $("altBtn").onclick = otherVideo;
  $("fsBtn").onclick = toggleFullscreen;
  $("quitBtn").onclick = quit;
  $("homeBtn").onclick = () => { show("home"); renderHome(); };

  renderHome();
  requestAnimationFrame((t) => { lastTick = t; tick(t); });

  // exposed for quick testing in the console
  window.__workout = { get state() { return S; }, get player() { return player; }, startSession, next, back, togglePause };
})();
