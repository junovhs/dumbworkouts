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
  const PREVIEW_SECS = 7;     // how long each move previews on the start screen

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
  // Best video for a tall preview panel: the chosen one if vertical, else any vertical option.
  function previewVideo(key) {
    const cur = currentVideo(key);
    return cur.shape === "tall" ? cur : videoOptions(key).find((v) => v.shape === "tall") || cur;
  }
  function thumb(v) {
    return v.shape === "tall" ? `https://i.ytimg.com/vi/${v.id}/oar2.jpg` : `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`;
  }
  // YouTube answers a missing tall thumbnail with a tiny grey placeholder (HTTP 404 but a valid image),
  // so fall back on errors *and* on suspiciously small images.
  function setImg(img, v) {
    const fallback = () => { img.onerror = img.onload = null; img.src = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`; };
    img.onerror = fallback;
    img.onload = () => { if (img.naturalWidth < 200) fallback(); else img.onload = null; };
    img.src = thumb(v);
  }

  // ---------- history ----------
  const history = () => store.get("history", []);
  function suggestedDay() {
    const h = history();
    const last = [...h].reverse().find((x) => typeof x.day === "number");
    return last ? (last.day % DAYS.length) + 1 : 1;
  }
  const dayKey = (d) => new Date(d).toDateString();
  function fmtDate(iso) {
    const d = new Date(iso), today = new Date();
    const days = Math.round((new Date(today.toDateString()) - new Date(d.toDateString())) / 864e5);
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }
  function streak() {
    const done = new Set(history().map((h) => dayKey(h.date)));
    const d = new Date();
    if (!done.has(d.toDateString())) d.setDate(d.getDate() - 1);
    let n = 0;
    while (done.has(d.toDateString())) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  // ---------- views ----------
  let view = "home";
  function show(v) {
    view = v;
    for (const id of ["home", "menu", "session", "done"]) $(id).classList.toggle("hidden", id !== v);
    if (v === "home") startPreview(); else stopPreview();
  }

  // ---------- muscles + body map ----------
  const MUS = window.MUSCLES;
  const NEUTRAL = new Set(["head", "neck", "knees"]);
  function bodyMap(primary, secondary) {
    const lit = new Map();
    for (const m of secondary) for (const r of MUS[m].regions) lit.set(r, "sec");
    for (const m of primary) for (const r of MUS[m].regions) lit.set(r, "pri");
    const fig = (side, h) =>
      `<svg class="bm" viewBox="0 0 100 ${h}" aria-hidden="true">` +
      window.BODY_MAP[side].map(([r, pts]) => pts.map((pt) => `<polygon points="${pt}"${lit.has(r) ? ` class="${lit.get(r)}"` : NEUTRAL.has(r) ? ' class="skin"' : ""}/>`).join("")).join("") +
      `</svg>`;
    return `<div class="bm-figs"><div>${fig("front", 200)}<span>Front</span></div><div>${fig("back", 220)}<span>Back</span></div></div>`;
  }
  const cardCache = new Map();
  function muscleCard(e) {
    if (!cardCache.has(e)) {
      cardCache.set(e, `${bodyMap(e.primary, e.secondary)}
        <div class="mlist">
          ${e.primary.map((m) => `<div class="mrow"><b>${MUS[m].name}</b><span>${MUS[m].does}</span></div>`).join("")}
          ${e.secondary.length ? `<div class="malso">Also works: ${e.secondary.map((m) => MUS[m].name).join(" · ")}</div>` : ""}
        </div>`);
    }
    return cardCache.get(e);
  }
  window.__bodyMap = bodyMap;

  // ---------- HOME: 3D carousel ----------
  const dumbbellText = (n) => (n === 0 ? "No weight" : n === 1 ? "1 dumbbell" : "2 dumbbells");
  const minutesFor = (r) => ["", "9–10 min", "14–15 min", "18–20 min"][r] || "";
  function dumbbellRange(day) {
    const ns = day.moves.map((k) => EX[k].dumbbells).filter((n) => n > 0);
    const lo = Math.min(...ns), hi = Math.max(...ns);
    return lo === hi ? dumbbellText(lo) : `${lo}–${hi} dumbbells`;
  }

  const MENU_CARD = { menu: true, title: "À la carte", color: "#f5b82e",
    moves: ["couchHipThrust", "sumoSquat", "curtsyLunge", "fireHydrant", "singleLegRdl"] };
  const CARDS = [...DAYS, MENU_CARD];
  let focus = suggestedDay() - 1;
  let panels = [];
  function activate(i) { const c = CARDS[i]; c.menu ? openMenu() : startSession(c.n); }

  function buildCarousel() {
    const wrap = $("carousel");
    wrap.innerHTML = "";
    const h = history(), sug = suggestedDay();
    panels = CARDS.map((d, i) => {
      const last = [...h].reverse().find((x) => x.day === d.n);
      const p = document.createElement("article");
      p.className = "p3d" + (d.menu ? " menu-card" : "");
      p.style.setProperty("--c", d.color);
      p.innerHTML = d.menu ? `
        <div class="p-art">
          <img class="p-photo" alt="">
          <div class="p-vid"></div>
        </div>
        <div class="p-shade"></div>
        <div class="p-gloss"></div>
        <div class="p-top"><span class="p-day">BUILD YOUR OWN</span><span class="p-next">NEW</span></div>
        <div class="p-body">
          <h2 class="p-title">À LA<br>CARTE</h2>
          <div class="p-meta"><span>${Object.keys(EX).length} moves</span><span>pick a body area</span></div>
          <ol class="p-moves">${AREAS.map((a, j) => `<li data-j="${j}"><span>${a.name}</span><em>${poolFor(a.id).length} moves</em></li>`).join("")}</ol>
          <button class="p-go">OPEN MENU <kbd>Enter</kbd></button>
        </div>` : `
        <div class="p-art">
          <img class="p-photo" alt="">
          <div class="p-vid"></div>
        </div>
        <div class="p-shade"></div>
        <div class="p-gloss"></div>
        <div class="p-top">
          <span class="p-day">DAY ${d.n}</span>
          ${d.n === sug ? '<span class="p-next">UP NEXT</span>' : last ? `<span class="p-last">✓ ${fmtDate(last.date)}</span>` : ""}
        </div>
        <div class="p-body">
          <h2 class="p-title">${d.title.replace(/ \+ /g, "<br>+ ")}</h2>
          <div class="p-meta"><span>5 moves</span><span class="p-mins"></span><span>${dumbbellRange(d)}</span></div>
          <ol class="p-moves">${d.moves.map((k, j) => `<li data-j="${j}"><span>${EX[k].name}</span><em>${EX[k].reps}</em></li>`).join("")}</ol>
          <button class="p-go">START <kbd>Enter</kbd></button>
        </div>`;
      setImg(p.querySelector(".p-photo"), previewVideo(d.moves[0]));
      p.addEventListener("click", (e) => {
        if (i !== focus) { setFocus(i); return; }
        if (e.target.closest(".p-go") || e.target.closest(".p-art") || e.target.closest(".p-shade")) activate(i);
      });
      p.querySelector(".p-go").addEventListener("click", (e) => { e.stopPropagation(); if (i === focus) activate(i); });
      wrap.appendChild(p);
      return p;
    });
    layout(true);
  }

  function layout(instant) {
    const n = panels.length;
    panels.forEach((p, i) => {
      // circular: one panel on the left, the rest on the right (for 4 days: -1, 0, 1, 2)
      const d = (((i - focus) % n) + n + 1) % n - 1, a = Math.abs(d), s = Math.sign(d);
      const prev = p.dataset.d === undefined ? d : +p.dataset.d;
      p.dataset.d = d;
      p.classList.toggle("focused", d === 0);
      // a panel wrapping from one end to the other jumps instead of sweeping through the front
      p.classList.toggle("instant", !!instant || Math.abs(prev - d) > 1);
      p.style.setProperty("--d", d);
      p.style.setProperty("--a", a);
      p.style.setProperty("--s", s);
      p.style.zIndex = 10 - a;
    });
    document.documentElement.style.setProperty("--accent", CARDS[focus].color);
    renderRounds();
  }

  function setFocus(i) {
    i = ((i % CARDS.length) + CARDS.length) % CARDS.length;
    if (i === focus) return;
    focus = i;
    sfx("move");
    layout(false);
    startPreview();
  }

  function renderRounds() {
    const el = $("roundsPick");
    el.innerHTML = "";
    for (let r = 1; r <= 3; r++) {
      const b = document.createElement("button");
      b.textContent = r;
      b.className = r === settings.rounds ? "on" : "";
      b.onclick = () => setRounds(r);
      el.appendChild(b);
    }
    $("roundsTime").textContent = minutesFor(settings.rounds);
    panels.forEach((p) => { const m = p.querySelector(".p-mins"); if (m) m.textContent = minutesFor(settings.rounds); });
  }
  function setRounds(r) {
    r = Math.max(1, Math.min(3, r));
    if (r === settings.rounds) { sfx("edge"); return; }
    settings.rounds = r; save("rounds"); sfx("tick"); renderRounds();
  }

  function renderStats() {
    const h = history(), st = streak(), sug = suggestedDay();
    const last = h[h.length - 1];
    $("stats").innerHTML = `
      <div class="stat"><b>${st}</b><span>day streak${st ? " 🔥" : ""}</span></div>
      <div class="stat"><b>${h.length}</b><span>workouts</span></div>
      <div class="stat wide"><b>${last ? (last.custom || "Day " + last.day) : "—"}</b><span>${last ? "last, " + fmtDate(last.date) : "nothing yet"}</span></div>
      <div class="stat wide"><b>Day ${sug}</b><span>up next</span></div>`;
  }

  function renderSettings() {
    segmented($("restSeg"), [[20, "20s"], [30, "30s"], [45, "45s"], [0, "None"]], settings.rest, (v) => { settings.rest = v; save("rest"); renderSettings(); });
    segmented($("beepSeg"), [[true, "On"], [false, "Off"]], settings.beeps, (v) => { settings.beeps = v; save("beeps"); renderSettings(); });
    $("rules").innerHTML = window.RULES.map((r) => `<li>${r}</li>`).join("");
  }
  function segmented(el, options, value, onPick) {
    el.innerHTML = "";
    for (const [val, label] of options) {
      const b = document.createElement("button");
      b.textContent = label;
      b.className = val === value ? "on" : "";
      b.onclick = () => onPick(val);
      el.appendChild(b);
    }
  }
  const sheetOpen = () => !$("sheet").classList.contains("hidden");
  function toggleSheet(open) {
    $("sheet").classList.toggle("hidden", !open);
    if (open) renderSettings();
  }

  function renderHome() {
    focus = Math.min(Math.max(focus, 0), CARDS.length - 1);
    renderStats();
    buildCarousel();
    startPreview();
  }

  // Tilt the focused panel toward the mouse for a bit of depth.
  let tiltQueued = null;
  $("carousel").addEventListener("mousemove", (e) => {
    if (!tiltQueued) requestAnimationFrame(() => {
      const ev = tiltQueued; tiltQueued = null;
      const p = panels[focus];
      if (!p) return;
      const r = p.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
      const inside = Math.abs(x) < 0.7 && Math.abs(y) < 0.7;
      p.style.setProperty("--tx", inside ? (x * 8).toFixed(1) + "deg" : "0deg");
      p.style.setProperty("--ty", inside ? (-y * 6).toFixed(1) + "deg" : "0deg");
    });
    tiltQueued = e;
  });
  $("carousel").addEventListener("mouseleave", () => {
    const p = panels[focus];
    if (p) { p.style.setProperty("--tx", "0deg"); p.style.setProperty("--ty", "0deg"); }
  });
  let wheelLock = 0;
  $("carousel").addEventListener("wheel", (e) => {
    const dv = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(dv) < 12 || Date.now() < wheelLock) return;
    wheelLock = Date.now() + 350;
    setFocus(focus + Math.sign(dv), Math.sign(dv));
  }, { passive: true });

  // ---------- À LA CARTE ----------
  const AREAS = [
    { id: "butt", name: "Butt", color: "#e8336b", blurb: "Bridges, hinges, squats, lunges and side glutes" },
    { id: "legs", name: "Legs", color: "#f08a24", blurb: "Quads, hamstrings and inner thighs" },
    { id: "core", name: "Core", color: "#14a39a", blurb: "Abs, obliques and lower back" },
    { id: "upper", name: "Upper body", color: "#8a5cf6", blurb: "Chest, shoulders, back and arms" },
    { id: "arms", name: "Arms", color: "#3b82f6", blurb: "Biceps, triceps and grip" },
    { id: "full", name: "Full body", color: "#22c38e", blurb: "Legs, glutes, push, pull and core" },
  ];
  const PATTERN_LABEL = { squat: "Squat", hinge: "Hinge", lunge: "Single-leg", bridge: "Bridge", side: "Side glutes", kickback: "Glute isolation", core: "Core", push: "Push", pull: "Pull", arms: "Arms" };
  const UPPER = ["chest", "shoulders", "back", "arms"];
  function poolFor(area) {
    return Object.keys(EX).filter((k) => {
      const a = EX[k].areas || [];
      if (area === "full") return true;
      if (area === "upper") return a.some((x) => UPPER.includes(x));
      return a.includes(area);
    });
  }
  const shuffle = (xs) => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // pick one from candidates, preferring ones not in `avoid`
  const pickFrom = (cands, avoid) => { const fresh = cands.filter((k) => !avoid.has(k)); const c = shuffle(fresh.length ? fresh : cands); return c[0]; };

  function buildSet(area, avoid = new Set(), size = 5) {
    const pool = poolFor(area), used = new Set();
    const take = (filter) => {
      const k = pickFrom(pool.filter((x) => !used.has(x) && filter(EX[x])), avoid);
      if (k) used.add(k);
      return k;
    };
    let picks = [];
    if (area === "butt") {
      // always a hinge, a bridge and a side-glute move, plus two of squat / single-leg / isolation
      const extra = shuffle(["squat", "lunge", "squat", "lunge", "kickback"]);
      const pats = ["hinge", "bridge", "side"];
      for (const p of extra) if (pats.length < size && !pats.includes(p)) pats.push(p);
      const ORDER = ["squat", "hinge", "lunge", "bridge", "kickback", "side"];
      pats.sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
      picks = pats.map((p) => take((e) => e.pattern === p));
    } else if (area === "full") {
      const slots = [(e) => ["squat", "lunge"].includes(e.pattern), (e) => ["hinge", "bridge"].includes(e.pattern), (e) => e.pattern === "push", (e) => e.pattern === "pull", (e) => e.pattern === "core"];
      picks = slots.map(take);
    } else {
      // greedy: each next move adds the most main muscles not covered yet
      const covered = new Set();
      while (picks.length < size) {
        const cands = shuffle(pool.filter((k) => !used.has(k)));
        if (!cands.length) break;
        const score = (k) => EX[k].primary.filter((m) => !covered.has(m)).length * 10 - (avoid.has(k) ? 5 : 0);
        cands.sort((a, b) => score(b) - score(a));
        const k = cands[0];
        used.add(k); picks.push(k);
        EX[k].primary.forEach((m) => covered.add(m));
      }
      picks.sort((a, b) => EX[b].primary.length - EX[a].primary.length);
    }
    return picks.filter(Boolean);
  }

  let menuArea = 0, menuSet = [];
  function openMenu() {
    stopPreview();
    show("menu");
    sfx("start");
    selectArea(menuArea, true);
  }
  function selectArea(i, force) {
    i = ((i % AREAS.length) + AREAS.length) % AREAS.length;
    if (i === menuArea && !force) return;
    menuArea = i;
    if (!force) sfx("move");
    document.documentElement.style.setProperty("--accent", AREAS[i].color);
    menuSet = buildSet(AREAS[i].id);
    renderMenu();
  }
  function reshuffle() {
    menuSet = buildSet(AREAS[menuArea].id, new Set(menuSet));
    sfx("tick");
    renderMenu();
  }
  function swapOne(j) {
    const area = AREAS[menuArea].id, cur = menuSet[j], pat = EX[cur].pattern;
    const pool = poolFor(area).filter((k) => !menuSet.includes(k));
    const same = pool.filter((k) => EX[k].pattern === pat);
    const k = pickFrom(same.length ? same : pool, new Set());
    if (!k) { sfx("edge"); return; }
    menuSet[j] = k; sfx("tick"); renderMenu();
  }
  function renderMenu() {
    const area = AREAS[menuArea];
    $("areas").innerHTML = AREAS.map((a, i) => `
      <button class="area${i === menuArea ? " on" : ""}" data-i="${i}" style="--c:${a.color}">
        <b>${a.name}</b><span>${poolFor(a.id).length} moves · ${a.blurb}</span>
      </button>`).join("");
    $("areas").querySelectorAll(".area").forEach((b) => (b.onclick = () => selectArea(+b.dataset.i)));
    $("setTitle").textContent = `${area.name} workout`;
    $("setSub").textContent = `${menuSet.length} moves · ${settings.rounds} round${settings.rounds > 1 ? "s" : ""} · ${minutesFor(settings.rounds)}`;
    $("setList").innerHTML = menuSet.map((k, j) => {
      const e = EX[k], v = previewVideo(k);
      return `<li class="srow">
        <span class="snum">${j + 1}</span>
        <img class="sthumb" alt="" data-k="${k}">
        <div class="sinfo"><b>${e.name}</b><span>${e.reps} · ${dumbbellText(e.dumbbells)} · ${e.primary.map((m) => MUS[m].name).join(", ")}</span></div>
        <span class="spat">${PATTERN_LABEL[e.pattern] || ""}</span>
        <button class="sswap" data-j="${j}" title="Swap for a similar move">↻</button>
      </li>`;
    }).join("");
    $("setList").querySelectorAll(".sswap").forEach((b) => (b.onclick = () => swapOne(+b.dataset.j)));
    $("setList").querySelectorAll(".sthumb").forEach((img) => setImg(img, previewVideo(img.dataset.k)));
    const pri = new Set(menuSet.flatMap((k) => EX[k].primary));
    const sec = new Set(menuSet.flatMap((k) => EX[k].secondary).filter((m) => !pri.has(m)));
    $("setMap").innerHTML = bodyMap([...pri], [...sec]);
    $("setMuscles").innerHTML = [...pri].map((m) => `<span class="mchip pri">${MUS[m].name}</span>`).join("") + [...sec].map((m) => `<span class="mchip">${MUS[m].name}</span>`).join("");
    segmented($("menuRounds"), [[1, "1"], [2, "2"], [3, "3"]], settings.rounds, (r) => { settings.rounds = r; save("rounds"); renderMenu(); });
  }
  function startMenuSet() {
    if (!menuSet.length) return;
    const a = AREAS[menuArea];
    startSession({ n: null, custom: a.name, title: `${a.name} (à la carte)`, color: a.color, moves: [...menuSet] });
  }

  // ---------- start-screen preview player (focused panel only) ----------
  let preview = null, previewTimer = null, previewIdx = 0, previewGen = 0;
  function stopPreview() {
    clearTimeout(previewTimer);
    previewGen++;
    if (preview) { try { preview.destroy(); } catch {} preview = null; }
    document.querySelectorAll(".p-vid").forEach((v) => { v.innerHTML = ""; v.classList.remove("live"); });
    document.querySelectorAll(".p-moves li").forEach((li) => li.classList.remove("on"));
  }
  function startPreview() {
    stopPreview();
    if (view !== "home" || !panels[focus]) return;
    // On touch screens YouTube draws its dark tap-to-control overlay on top, so stick to the still photo there.
    if (matchMedia("(pointer: coarse)").matches) return;
    const gen = previewGen, p = panels[focus], day = CARDS[focus];
    previewIdx = 0;
    markPreviewMove(p, 0);
    ytReady.then(() => {
      if (gen !== previewGen) return;
      const holder = document.createElement("div");
      p.querySelector(".p-vid").appendChild(holder);
      preview = new YT.Player(holder, {
        host: "https://www.youtube-nocookie.com",
        videoId: previewVideo(day.moves[0]).id,
        playerVars: { autoplay: 1, mute: 1, controls: 0, rel: 0, playsinline: 1, modestbranding: 1, iv_load_policy: 3, disablekb: 1, fs: 0, loop: 1, playlist: previewVideo(day.moves[0]).id },
        events: {
          onReady: (ev) => { if (gen === previewGen) { ev.target.mute(); ev.target.playVideo(); } },
          onStateChange: (ev) => {
            if (gen !== previewGen) return;
            const vid = p.querySelector(".p-vid");
            if (ev.data === YT.PlayerState.PLAYING) {
              // let YouTube's title overlay fade before revealing
              setTimeout(() => { if (gen === previewGen) vid.classList.add("live"); }, 900);
              clearTimeout(previewTimer);
              previewTimer = setTimeout(() => cyclePreview(gen, p, day), PREVIEW_SECS * 1000);
            }
            if (ev.data === YT.PlayerState.ENDED) ev.target.seekTo(0, true);
          },
        },
      });
    });
  }
  function cyclePreview(gen, p, day) {
    if (gen !== previewGen || !preview) return;
    previewIdx = (previewIdx + 1) % day.moves.length;
    const v = previewVideo(day.moves[previewIdx]);
    const vid = p.querySelector(".p-vid");
    vid.classList.remove("live");
    setImg(p.querySelector(".p-photo"), v);
    markPreviewMove(p, previewIdx);
    setTimeout(() => { if (gen === previewGen && preview) preview.loadVideoById(v.id); }, 350);
  }
  function markPreviewMove(p, j) {
    p.querySelectorAll(".p-moves li").forEach((li) => li.classList.toggle("on", +li.dataset.j === j));
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
    const day = typeof n === "object" ? n : DAYS.find((d) => d.n === n);
    unlockAudio();
    sfx("start");
    S = { day, rounds: settings.rounds, steps: buildSteps(day, settings.rounds), i: 0, paused: false, started: Date.now(), spaceBlockUntil: Date.now() + 600 };
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
    $("tDay").textContent = S.day.custom ? `À la carte · ${S.day.custom}` : `Day ${S.day.n} · ${S.day.title}`;
    $("tRound").textContent = `Round ${st.round} of ${S.rounds}`;
    $("tMove").textContent = `Move ${st.idx + 1} of ${S.day.moves.length}`;
    $("phase").textContent = isRest ? `${st.label} · up next` : "Now";
    $("exName").textContent = e.name;
    $("exReps").textContent = e.reps;
    $("badges").innerHTML = `<span class="badge db">${dumbbellText(e.dumbbells)}</span>` + e.primary.map((m) => `<span class="badge">${MUS[m].name}</span>`).join("");
    $("muscleCard").innerHTML = muscleCard(e);
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

  function setText(el, txt) { if (el.textContent !== txt) el.textContent = txt; }
  function setClass(el, c, on) { if (el.classList.contains(c) !== on) el.classList.toggle(c, on); }
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
      setClass(t, "hidden", false);
      setText(t, fmt(S.remaining));
      setClass(t, "warn", S.remaining <= 3.05);
    } else setClass(t, "hidden", true);
    if (timed) {
      setClass(side, "hidden", false);
      const sides = EX[st.key].timed.sides;
      setText(side, `Side ${S.side + 1} of ${sides.length}: ${sides[S.side]}`);
    } else setClass(side, "hidden", true);
    const el = Math.floor((Date.now() - S.started) / 1000);
    setText($("elapsed"), `Workout time ${Math.floor(el / 60)}:${String(el % 60).padStart(2, "0")}`);
  }

  function renderPause() {
    $("pausedBadge").classList.toggle("hidden", !S.paused);
    $("pauseIc").textContent = S.paused ? "▶" : "❚❚";
    $("pauseTxt").textContent = S.paused ? "Play" : "Pause";
    $("session").classList.toggle("is-paused", S.paused);
  }

  let lastTick = performance.now();
  function tick() {
    const now = performance.now();
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
    h.push({ day: S.day.custom ? null : S.day.n, custom: S.day.custom, rounds: S.rounds, date: new Date().toISOString(), minutes: Math.round((Date.now() - S.started) / 60000) });
    store.set("history", h.slice(-200));
    beep(523, 0.15); setTimeout(() => beep(659, 0.15), 160); setTimeout(() => beep(784, 0.3), 320);
    endSession();
    $("doneTitle").textContent = S.day.custom ? `${S.day.custom} done!` : `Day ${S.day.n} done!`;
    const mins = Math.max(1, Math.round((Date.now() - S.started) / 60000));
    $("doneSub").textContent = `${S.rounds} round${S.rounds > 1 ? "s" : ""} of ${S.day.title} in about ${mins} minute${mins > 1 ? "s" : ""}.`;
    const st = streak();
    $("doneNext").textContent = `${st > 1 ? `🔥 ${st}-day streak · ` : ""}Next time: Day ${suggestedDay()} — ${DAYS[suggestedDay() - 1].title}`;
    if (!S.day.custom) focus = suggestedDay() - 1;
    show("done");
  }

  function flash(text) {
    const f = document.createElement("div");
    f.className = "flash";
    f.textContent = text;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1600);
  }

  // ---------- YouTube ----------
  let ytResolve;
  const ytReady = new Promise((r) => (ytResolve = r));
  let player = null, playerReady = false, pendingVideo = null;
  window.onYouTubeIframeAPIReady = () => {
    ytResolve();
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
  function beep(freq, dur, vol = 0.35, type = "sine", toFreq) {
    if (!settings.beeps || !actx) return;
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
    o.frequency.setValueAtTime(freq, t); o.type = type;
    if (toFreq) o.frequency.exponentialRampToValueAtTime(toFreq, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(actx.destination);
    o.start(); o.stop(t + dur + 0.02);
  }
  function sfx(kind) {
    unlockAudio();
    if (kind === "move") beep(520, 0.09, 0.12, "triangle", 880);
    else if (kind === "tick") beep(1100, 0.05, 0.1, "square");
    else if (kind === "edge") beep(160, 0.12, 0.15, "triangle", 110);
    else if (kind === "start") { beep(440, 0.12, 0.2, "triangle", 660); setTimeout(() => beep(660, 0.25, 0.22, "triangle", 1320), 110); }
  }

  // ---------- input ----------
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (view === "home") {
      if (sheetOpen()) {
        if (k === "Escape" || k === "s" || k === "S") { e.preventDefault(); toggleSheet(false); }
        return;
      }
      const act = {
        ArrowLeft: () => setFocus(focus - 1, -1), ArrowRight: () => setFocus(focus + 1, 1),
        ArrowUp: () => setRounds(settings.rounds + 1), ArrowDown: () => setRounds(settings.rounds - 1),
        Enter: () => activate(focus), " ": () => activate(focus),
        s: () => toggleSheet(true), S: () => toggleSheet(true),
      }[k];
      if (act) { e.preventDefault(); act(); }
      else if (/^[1-5]$/.test(k)) { e.preventDefault(); setFocus(+k - 1, 1); }
      return;
    }
    if (view === "menu") {
      const act = {
        ArrowUp: () => selectArea(menuArea - 1), ArrowDown: () => selectArea(menuArea + 1),
        ArrowLeft: () => selectArea(menuArea - 1), ArrowRight: () => selectArea(menuArea + 1),
        r: reshuffle, R: reshuffle, Enter: startMenuSet, " ": startMenuSet,
        Escape: () => { show("home"); renderHome(); }, Backspace: () => { show("home"); renderHome(); },
      }[k];
      if (act) { e.preventDefault(); act(); }
      else if (/^[1-3]$/.test(k)) { e.preventDefault(); settings.rounds = +k; save("rounds"); sfx("tick"); renderMenu(); }
      return;
    }
    if (view === "done") {
      if (k === "Enter" || k === "Escape" || k === " ") { e.preventDefault(); show("home"); renderHome(); }
      return;
    }
    if (k === " ") {
      e.preventDefault();
      if (e.repeat || Date.now() < (S.spaceBlockUntil || 0)) return;
      const now = Date.now();
      if (now - lastSpace < DOUBLE_TAP_MS) { lastSpace = 0; next(); flash("NEXT ▶▶"); }
      else { lastSpace = now; togglePause(); }
      return;
    }
    const map = {
      Enter: next, ArrowRight: next, ArrowLeft: back, Backspace: back,
      f: toggleFullscreen, F: toggleFullscreen, m: toggleSound, M: toggleSound, v: otherVideo, V: otherVideo, Escape: quit,
    };
    if (map[k]) { e.preventDefault(); map[k](); }
  });
  const DOUBLE_TAP_MS = 400;
  let lastSpace = 0;
  // Keep keyboard focus out of buttons so Space/Enter always go to our handler.
  document.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) b.blur(); });

  $("shield").onclick = togglePause;
  $("pauseBtn").onclick = togglePause;
  $("nextBtn").onclick = next;
  $("backBtn").onclick = back;
  $("soundBtn").onclick = toggleSound;
  $("altBtn").onclick = otherVideo;
  $("fsBtn").onclick = toggleFullscreen;
  $("quitBtn").onclick = quit;
  $("homeBtn").onclick = () => { show("home"); renderHome(); };
  $("settingsBtn").onclick = () => toggleSheet(true);
  $("menuBack").onclick = () => { show("home"); renderHome(); };
  $("shuffleBtn").onclick = reshuffle;
  $("setStart").onclick = startMenuSet;
  $("sheetClose").onclick = () => toggleSheet(false);
  $("sheet").addEventListener("click", (e) => { if (e.target.id === "sheet") toggleSheet(false); });

  renderHome();
  setInterval(tick, 100);

  // exposed for quick testing in the console
  window.__workout = {
    get state() { return S; }, get player() { return player; }, get preview() { return preview; }, get focus() { return focus; },
    startSession, next, back, togglePause, setFocus, buildSet, poolFor, openMenu, get menuSet() { return menuSet; },
  };
})();
