/* Dumbbell Workouts — guided player. Compiled from TypeScript for browser delivery. */
(() => {
  const $ = (id: string): UIElement => document.getElementById(id) as UIElement;
  const EX = window.EXERCISES, DAYS = window.DAYS;

  // ---------- persisted settings ----------
  const store = {
    get<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set<T>(k: string, v: T): void { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const settings: WorkoutSettings = {
    rounds: store.get("rounds", 1),
    rest: store.get("rest", 30),
    beeps: store.get("beeps", true),
    sound: store.get("sound", false),
    coach: store.get("coach", "any"),   // videos by: "any" | "f" (women) | "m" (men)
  };
  const save = (k: keyof WorkoutSettings) => store.set(k, settings[k]);

  const READY_SECS = 10;      // "get ready" before the first move
  const ROUND_REST = 60;      // rest between rounds
  const PREVIEW_SECS = 7;     // how long each move previews on the start screen

  // ---------- video choice per exercise ----------
  function videoOptions(key) {
    const e = EX[key];
    const custom = store.get<ExerciseVideo | null>("custom:" + key, null);
    const all = [e.video].concat(e.alts || []);
    // Keep videos matching the Videos setting; unknown presenters fit either. If a move has none, show them all.
    const fits = (v) => settings.coach === "any" || !window.PRESENTER[v.id] || window.PRESENTER[v.id] === settings.coach;
    const picked = all.filter(fits);
    return (custom ? [custom] : []).concat(picked.length ? picked : all);
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
  function setImg(img: HTMLImageElement, v: ExerciseVideo) {
    const fallback = () => { img.onerror = img.onload = null; img.src = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`; };
    img.onerror = fallback;
    img.onload = () => { if (img.naturalWidth < 200) fallback(); else img.onload = null; };
    img.src = thumb(v);
  }

  // ---------- program: your wizard plan, or the classic Days 1-4 ----------
  const PL = window.PLANNER;
  let plan = store.get<WorkoutPlan | null>("plan", null);
  const program = () => (plan ? plan.days : DAYS);
  const progId = () => (plan ? plan.id : "classic");
  const savePlan = () => store.set("plan", plan);
  // "swap a couple each week" plans refresh on the first visit of a new week
  function refreshPlan() {
    if (!plan || plan.answers.variety !== "weekly") return;
    const wk = PL.weekKey(new Date());
    if (plan.week === wk) return;
    PL.weeklySwap(plan);
    plan.week = wk;
    savePlan();
  }

  // ---------- history ----------
  const history = (): WorkoutHistory[] => store.get<WorkoutHistory[]>("history", []);
  function suggestedDay() {
    const h = history(), id = progId(), len = program().length;
    const last = [...h].reverse().find((x) => typeof x.day === "number" && (x.prog || "classic") === id);
    return last ? (last.day % len) + 1 : 1;
  }
  const dayKey = (d) => new Date(d).toDateString();
  function fmtDate(iso) {
    const d = new Date(iso), today = new Date();
    const days = Math.round((new Date(today.toDateString()).getTime() - new Date(d.toDateString()).getTime()) / 864e5);
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
    for (const id of ["home", "menu", "wizard", "calendar", "session", "done"]) $(id).classList.toggle("hidden", id !== v);
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
  const cardCache = new Map<Exercise, string>();
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
  // rough length: ~70 s per move (both sides, setup) plus rests
  const estMinutes = (moves, rounds, rest = settings.rest) =>
    Math.max(1, Math.round((moves * rounds * (70 + rest) - rest + (rounds - 1) * (Math.max(rest, ROUND_REST) - rest) + READY_SECS) / 60));
  const minutesFor = (r, moves = 5) => `~${estMinutes(moves, r)} min`;
  function dumbbellRange(day) {
    const ns = day.moves.map((k) => EX[k].dumbbells).filter((n) => n > 0);
    if (!ns.length) return "No weight";
    const lo = Math.min(...ns), hi = Math.max(...ns);
    return lo === hi ? dumbbellText(lo) : `${lo}–${hi} dumbbells`;
  }

  const MENU_CARD: WorkoutDay = { menu: true, title: "À la carte", color: "#f5b82e",
    moves: ["couchHipThrust", "sumoSquat", "curtsyLunge", "fireHydrant", "singleLegRdl"] };
  const PLAN_CARD: WorkoutDay = { plan: true, title: "My plan", color: "#22c38e",
    moves: ["gobletSquat", "floorPress", "couchHipThrust", "bentOverRow", "deadBug"] };
  let CARDS: WorkoutDay[] = [];
  let focus = 0;
  let panels: HTMLElement[] = [];
  function activate(i) { const c = CARDS[i]; c.menu ? openMenu() : c.plan ? openWizard() : startSession(c); }
  const FOCUS_LABEL = { balanced: "Balanced", booty: "Booty focus", lower: "Legs & butt", upper: "Upper body" };
  const LEVEL_LABEL = { new: "Brand new", back: "Getting back into it", regular: "Regular" };
  function planLines() {
    if (!plan) return [["Now using", "Classic Days 1–4"], ["Answer", "4 quick taps"], ["Get", "workouts built for you"], ["Then", "it learns as you go"]];
    const a = plan.answers;
    return [["Level", LEVEL_LABEL[a.level]], ["Focus", FOCUS_LABEL[a.focus]], ["Per week", `${a.perWeek} days`],
      ["Dumbbells", ["None", "One", "A pair"][a.dumbbells]], ["Learned", `${favs().length} ♥ · ${nope().length} skipped`]];
  }

  function buildCarousel() {
    const wrap = $("carousel");
    wrap.innerHTML = "";
    const h = history(), sug = suggestedDay(), id = progId();
    panels = CARDS.map((d, i) => {
      const last = d.n && [...h].reverse().find((x) => x.day === d.n && (x.prog || "classic") === id);
      const p = document.createElement("article");
      p.className = "p3d" + (d.menu ? " menu-card" : "") + (d.plan ? " plan-card" : "");
      p.style.setProperty("--c", d.color);
      p.innerHTML = d.plan ? `
        <div class="p-art">
          <img class="p-photo" alt="">
          <div class="p-vid"></div>
        </div>
        <div class="p-shade"></div>
        <div class="p-gloss"></div>
        <div class="p-top"><span class="p-day">${plan ? "YOUR PLAN" : "SET UP"}</span>${plan ? "" : '<span class="p-next">NEW</span>'}</div>
        <div class="p-body">
          <h2 class="p-title">${plan ? "EDIT<br>MY PLAN" : "BUILD<br>MY PLAN"}</h2>
          <div class="p-meta"><span>${plan ? plan.days.length + " workouts" : "about 1 minute"}</span><span>${plan ? "rotation" : "4 questions"}</span></div>
          <ol class="p-moves">${planLines().map(([k, v], j) => `<li data-j="${j}"><span>${k}</span><em>${v}</em></li>`).join("")}</ol>
          <button class="p-go">${plan ? "CHANGE PLAN" : "LET'S GO"} <kbd>Enter</kbd></button>
        </div>` : d.menu ? `
        <div class="p-art">
          <img class="p-photo" alt="">
          <div class="p-vid"></div>
        </div>
        <div class="p-shade"></div>
        <div class="p-gloss"></div>
        <div class="p-top"><span class="p-day">BUILD YOUR OWN</span><span class="p-next">NEW</span></div>
        <div class="p-body">
          <h2 class="p-title">À LA<br>CARTE</h2>
          <div class="p-meta"><span>${Object.keys(EX).length} moves</span><span>${savedSets().length ? savedSets().length + " saved sets" : "pick a body area"}</span></div>
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
          <span class="p-day">${plan ? "WORKOUT" : "DAY"} ${d.n}</span>
          ${d.n === sug ? '<span class="p-next">UP NEXT</span>' : last ? `<span class="p-last">✓ ${fmtDate(last.date)}</span>` : ""}
        </div>
        <div class="p-body">
          <h2 class="p-title">${d.title.replace(/ \+ /g, "<br>+ ")}</h2>
          <div class="p-meta"><span>${d.moves.length} moves</span><span class="p-mins" data-n="${d.moves.length}"></span><span>${dumbbellRange(d)}</span></div>
          <ol class="p-moves">${d.moves.map((k, j) => `<li data-j="${j}"><span>${EX[k].name}</span><em>${EX[k].reps}</em></li>`).join("")}</ol>
          <button class="p-go">START <kbd>Enter</kbd></button>
        </div>`;
      setImg(p.querySelector<UIElement>(".p-photo"), previewVideo(d.moves[0]));
      p.addEventListener("click", (e) => {
        if (i !== focus) { setFocus(i); return; }
        if (e.target.closest(".p-go") || e.target.closest(".p-art") || e.target.closest(".p-shade")) activate(i);
      });
      p.querySelector<UIElement>(".p-go").addEventListener("click", (e) => { e.stopPropagation(); if (i === focus) activate(i); });
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
    panels.forEach((p) => { const m = p.querySelector<UIElement>(".p-mins"); if (m) m.textContent = minutesFor(settings.rounds, +m.dataset.n); });
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
      <div class="stat wide"><b>${plan ? program()[sug - 1].title : "Day " + sug}</b><span>up next</span></div>`;
  }

  function renderSettings() {
    segmented($("restSeg"), [[20, "20s"], [30, "30s"], [45, "45s"], [0, "None"]], settings.rest, (v) => { settings.rest = v; save("rest"); renderSettings(); });
    segmented($("beepSeg"), [[true, "On"], [false, "Off"]], settings.beeps, (v) => { settings.beeps = v; save("beeps"); renderSettings(); });
    segmented($("coachSeg"), [["any", "Anyone"], ["f", "Women"], ["m", "Men"]], settings.coach, (v) => {
      if (v === settings.coach) return;
      settings.coach = v; save("coach"); renderSettings(); renderHome();
    });
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

  let focusSet = false;
  function renderHome() {
    refreshPlan();
    CARDS = [...program(), MENU_CARD, PLAN_CARD];
    if (!focusSet) { focus = suggestedDay() - 1; focusSet = true; }
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
    { id: "all", name: "Pick your own", color: "#eab308", blurb: "Browse every move and choose" },
    { id: "butt", name: "Butt", color: "#e8336b", blurb: "Bridges, hinges, squats, lunges and side glutes" },
    { id: "legs", name: "Legs", color: "#f08a24", blurb: "Quads, hamstrings and inner thighs" },
    { id: "core", name: "Core", color: "#14a39a", blurb: "Abs, obliques and lower back" },
    { id: "upper", name: "Upper body", color: "#8a5cf6", blurb: "Chest, shoulders, back and arms" },
    { id: "arms", name: "Arms", color: "#3b82f6", blurb: "Biceps, triceps and grip" },
    { id: "full", name: "Full body", color: "#22c38e", blurb: "Legs, glutes, push, pull and core" },
    { id: "favs", name: "♥ Favorites", color: "#ff5c8a", blurb: "Built from moves you've hearted" },
  ];
  const savedSets = (): SavedSet[] => store.get<SavedSet[]>("sets", []);
  // menu list = body areas, then your saved sets
  const menuItems = (): MenuItem[] => [...AREAS.map((a) => ({ kind: "area" as const, ...a })), ...savedSets().map((x) => ({ kind: "set" as const, ...x }))];
  const curItem = () => menuItems()[menuArea] || menuItems()[0];
  const PATTERN_LABEL = { squat: "Squat", hinge: "Hinge", lunge: "Single-leg", bridge: "Bridge", side: "Side glutes", kickback: "Glute isolation", core: "Core", push: "Push", pull: "Pull", arms: "Arms" };
  const UPPER = ["chest", "shoulders", "back", "arms"];
  function poolFor(area) {
    if (area === "favs") return favs().filter((k) => EX[k]);
    const banned = new Set(nope());
    return Object.keys(EX).filter((k) => !banned.has(k)).filter((k) => {
      const a = EX[k].areas || [];
      if (area === "full" || area === "all") return true;
      if (area === "upper") return a.some((x) => UPPER.includes(x));
      return a.includes(area);
    });
  }
  const shuffle = <T>(xs: T[]): T[] => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
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

  let menuArea = 1, menuSet: string[] = [], menuDirty = false;
  function openMenu() {
    stopPreview();
    show("menu");
    sfx("start");
    selectArea(menuArea, true);
  }
  function selectArea(i, force) {
    const n = menuItems().length;
    i = ((i % n) + n) % n;
    if (i === menuArea && !force) return;
    menuArea = i;
    if (!force) sfx("move");
    const it = curItem();
    document.documentElement.style.setProperty("--accent", it.color);
    menuSet = it.kind === "set" ? it.moves.filter((k) => EX[k]) : it.id === "all" ? [] : buildSet(it.id);
    menuDirty = false;
    renderMenu();
  }
  function reshuffle() {
    menuSet = buildSet(curItem().area || curItem().id, new Set(menuSet));
    menuDirty = true;
    sfx("tick");
    renderMenu();
  }
  function saveSet() {
    const it = curItem(), sets = savedSets();
    if (!menuSet.length) return;
    if (it.kind === "set") {
      const x = sets.find((y) => y.id === it.id);
      x.moves = [...menuSet];
      store.set("sets", sets);
      menuDirty = false;
      flash("SET UPDATED");
      renderMenu();
      return;
    }
    const name = prompt("Name this set", `${it.name.replace("♥ ", "")} set ${sets.filter((x) => x.area === it.id).length + 1}`);
    if (!name) return;
    sets.push({ id: "s" + Date.now().toString(36), name: name.slice(0, 40), area: it.id, color: it.color, moves: [...menuSet] });
    store.set("sets", sets);
    flash("SET SAVED");
    selectArea(AREAS.length + sets.length - 1, true);
  }
  function deleteSet() {
    const it = curItem();
    if (it.kind !== "set" || !confirm(`Delete "${it.name}"?`)) return;
    store.set("sets", savedSets().filter((x) => x.id !== it.id));
    selectArea(0, true);
  }
  function swapOne(j) {
    const area = curItem().area || curItem().id, cur = menuSet[j], pat = EX[cur].pattern;
    const pool = poolFor(area).filter((k) => !menuSet.includes(k));
    const same = pool.filter((k) => EX[k].pattern === pat);
    const k = pickFrom(same.length ? same : pool, new Set());
    if (!k) { sfx("edge"); return; }
    menuSet[j] = k; menuDirty = true; sfx("tick"); renderMenu();
  }
  function renderMenu() {
    const area = curItem(), items = menuItems(), fv = favs();
    $("areas").innerHTML = items.map((a, i) => `${i === AREAS.length ? '<div class="areas-h">My sets</div>' : ""}
      <button class="area${a.kind === "set" ? " saved" : ""}${i === menuArea ? " on" : ""}" data-i="${i}" style="--c:${a.color}">
        <b>${a.name}</b><span>${a.kind === "set" ? `${a.moves.length} moves · saved` : a.id === "favs" && !fv.length ? "Tap ♡ on any move to add it" : `${poolFor(a.id).length} moves · ${a.blurb}`}</span>
      </button>`).join("");
    $("areas").querySelectorAll<UIElement>(".area").forEach((b) => (b.onclick = () => selectArea(+b.dataset.i)));
    $("setTitle").textContent = area.kind === "set" ? area.name : `${area.name.replace("♥ ", "")} workout`;
    $("setSub").textContent = menuSet.length ? `${menuSet.length} move${menuSet.length > 1 ? "s" : ""} · ${settings.rounds} round${settings.rounds > 1 ? "s" : ""} · ${minutesFor(settings.rounds, menuSet.length)}` : "";
    $("setList").innerHTML = menuSet.map((k, j) => {
      const e = EX[k], v = previewVideo(k);
      return `<li class="srow">
        <span class="snum">${j + 1}</span>
        <img class="sthumb" alt="" data-k="${k}">
        <div class="sinfo"><b>${e.name}</b><span>${e.reps} · ${dumbbellText(e.dumbbells)} · ${e.primary.map((m) => MUS[m].name).join(", ")}</span></div>
        <span class="spat">${PATTERN_LABEL[e.pattern] || ""}</span>
        <button class="sfav${fv.includes(k) ? " on" : ""}" data-k="${k}" title="Favorite">${fv.includes(k) ? "♥" : "♡"}</button>
        <button class="sswap" data-j="${j}" title="Swap for a similar move">↻</button>
        <button class="sdel" data-j="${j}" title="Remove">✕</button>
      </li>`;
    }).join("");
    $("setList").querySelectorAll<UIElement>(".sswap").forEach((b) => (b.onclick = () => swapOne(+b.dataset.j)));
    $("setList").querySelectorAll<UIElement>(".sdel").forEach((b) => (b.onclick = () => { menuSet.splice(+b.dataset.j, 1); menuDirty = true; sfx("tick"); renderMenu(); }));
    $("setList").querySelectorAll<UIElement>(".sfav").forEach((b) => (b.onclick = () => { toggleFav(b.dataset.k); sfx("tick"); renderMenu(); }));
    if (!menuSet.length) $("setList").innerHTML = `<li class="sempty">${area.id === "favs" ? "No favorites yet. Pick any body area and tap ♡ on the moves you like, or press H during a workout." : `Nothing picked yet. <button class="hud-btn" id="emptyAdd">＋ Browse all ${poolFor("all").length} moves <kbd>A</kbd></button>`}</li>`;
    if ($("emptyAdd")) $("emptyAdd").onclick = openPicker;
    $("saveSetBtn").innerHTML = area.kind === "set" ? `✓ Save changes <kbd>S</kbd>` : `♥ Save set <kbd>S</kbd>`;
    $("saveSetBtn").disabled = area.kind === "set" ? !menuDirty : !menuSet.length;
    $("delSetBtn").classList.toggle("hidden", area.kind !== "set");
    $("setList").querySelectorAll<UIElement>(".sthumb").forEach((img) => setImg(img, previewVideo(img.dataset.k)));
    const pri = new Set(menuSet.flatMap((k) => EX[k].primary));
    const sec = new Set(menuSet.flatMap((k) => EX[k].secondary).filter((m) => !pri.has(m)));
    $("setMap").innerHTML = bodyMap([...pri], [...sec]);
    $("setMuscles").innerHTML = [...pri].map((m) => `<span class="mchip pri">${MUS[m].name}</span>`).join("") + [...sec].map((m) => `<span class="mchip">${MUS[m].name}</span>`).join("");
    segmented($("menuRounds"), [[1, "1"], [2, "2"], [3, "3"]], settings.rounds, (r) => { settings.rounds = r; save("rounds"); renderMenu(); });
  }
  // ---------- browse every move ----------
  let pickFilter = "all";
  const PICK_ORDER = ["squat", "lunge", "hinge", "bridge", "side", "kickback", "core", "push", "pull", "arms"];
  const pickerOpen = () => !$("picker").classList.contains("hidden");
  function openPicker() {
    $("picker").classList.remove("hidden");
    $("pickSearch").value = "";
    sfx("tick");
    renderPicker();
    $("pickSearch").focus();
  }
  function closePicker() { $("picker").classList.add("hidden"); $("pickSearch").blur(); renderMenu(); }
  function togglePick(k) {
    const i = menuSet.indexOf(k);
    if (i >= 0) menuSet.splice(i, 1); else menuSet.push(k);
    menuDirty = true; sfx("tick");
    renderPicker();
  }
  function renderPicker() {
    const filters = [["all", "All"], ...AREAS.filter((a) => !["all", "full"].includes(a.id)).map((a) => [a.id, a.name])];
    $("pickFilters").innerHTML = filters.map(([id, name]) => `<button class="${id === pickFilter ? "on" : ""}" data-f="${id}">${name}</button>`).join("");
    $("pickFilters").querySelectorAll<UIElement>("button").forEach((b) => (b.onclick = () => { pickFilter = b.dataset.f; renderPicker(); }));
    const q = $("pickSearch").value.trim().toLowerCase();
    const keys = poolFor(pickFilter).filter((k) => {
      if (!q) return true;
      const e = EX[k];
      return [e.name, PATTERN_LABEL[e.pattern] || "", ...e.primary.map((m) => MUS[m].name), ...e.secondary.map((m) => MUS[m].name)].join(" ").toLowerCase().includes(q);
    });
    const fv = favs();
    const groups = PICK_ORDER.map((p) => [p, keys.filter((k) => EX[k].pattern === p)]).filter(([, ks]) => ks.length);
    $("pickCount").textContent = `${menuSet.length} in your workout`;
    $("pickGrid").innerHTML = groups.map(([p, ks]) => `<h3 class="pick-h">${PATTERN_LABEL[p]} <span>${ks.length}</span></h3>
      <div class="pick-row">${ks.map((k) => {
        const e = EX[k], n = menuSet.indexOf(k) + 1;
        return `<button class="pcard${n ? " on" : ""}" data-k="${k}">
          <img loading="lazy" alt="" data-k="${k}">
          ${n ? `<span class="pnum">${n}</span>` : ""}${fv.includes(k) ? '<span class="pfav">♥</span>' : ""}
          <b>${e.name}</b>
          <span>${e.reps} · ${dumbbellText(e.dumbbells)}</span>
          <span class="pmus">${e.primary.map((m) => MUS[m].name).join(", ")}</span>
          <em>${n ? "✓ Added" : "＋ Add"}</em>
        </button>`;
      }).join("")}</div>`).join("") || `<div class="sempty">No moves match "${q.replace(/[<>&]/g, "")}".</div>`;
    $("pickGrid").querySelectorAll<UIElement>(".pcard").forEach((b) => (b.onclick = () => togglePick(b.dataset.k)));
    $("pickGrid").querySelectorAll<UIElement>("img").forEach((img) => setImg(img, previewVideo(img.dataset.k)));
  }
  $("pickSearch").addEventListener("input", renderPicker);
  $("pickSearch").addEventListener("keydown", (e) => { if (e.key === "Escape" || e.key === "Enter") { e.preventDefault(); closePicker(); } });
  $("pickDone").onclick = closePicker;
  $("picker").addEventListener("click", (e) => { if (e.target === $("picker")) closePicker(); });
  $("addBtn").onclick = openPicker;

  function startMenuSet() {
    if (!menuSet.length) return;
    const a = curItem(), name = a.name.replace("♥ ", "");
    startSession({ n: null, custom: name, title: a.kind === "set" ? name : `${name} (à la carte)`, color: a.color, moves: [...menuSet] });
  }


  // ---------- preferences learned from use ----------
  const favs = (): string[] => store.get<string[]>("favs", []);
  const nope = (): string[] => store.get<string[]>("nope", []);
  function toggleFav(k) {
    const f = favs(), i = f.indexOf(k);
    i >= 0 ? f.splice(i, 1) : f.push(k);
    store.set("favs", f);
    syncPrefs();
    return i < 0;
  }
  // keep the plan's generator inputs in step with what you've told us
  function syncPrefs() {
    if (!plan) return;
    plan.answers.likes = favs();
    plan.answers.dislikes = nope();
    savePlan();
  }
  // "Not for me": never pick this move again, and replace it in the plan right away
  function notForMe(k) {
    const n = nope();
    if (!n.includes(k)) n.push(k);
    store.set("nope", n);
    store.set("favs", favs().filter((x) => x !== k));
    syncPrefs();
    if (plan) for (const d of plan.days) {
      const j = d.moves.indexOf(k);
      if (j < 0) continue;
      const alt = Object.keys(EX).filter((x) => EX[x].pattern === EX[k].pattern && !d.moves.includes(x) && PL.allowed(x, plan.answers));
      if (alt.length) d.moves[j] = shuffle(alt)[0]; else d.moves.splice(j, 1);
    }
    savePlan();
  }

  // ---------- SETUP WIZARD: four one-tap questions ----------
  const QUESTIONS: Array<{ id: string; title: string; options: Array<[string | number, string, string]> }> = [
    { id: "level", title: "How much have you lifted before?", options: [
      ["new", "Brand new", "Simple moves while you learn the form"],
      ["back", "Getting back into it", "Some experience, a bit rusty"],
      ["regular", "Pretty regular", "Bring on the harder variations"]] },
    { id: "focus", title: "What do you want most?", options: [
      ["balanced", "Balanced", "Everything, evenly"],
      ["booty", "Booty focus", "Extra glute days"],
      ["lower", "Legs & butt", "Lower body first, some upper"],
      ["upper", "Upper body", "Arms, shoulders, back and core"]] },
    { id: "perWeek", title: "How many days a week?", options: [
      [2, "2 days", "Two full-body workouts"], [3, "3 days", "Three different full-body workouts"],
      [4, "4 days", "Lower and upper days take turns"], [5, "5+ days", "A longer rotation, muscles still get rest"]] },
    { id: "dumbbells", title: "What dumbbells do you have?", options: [
      [2, "A pair", "Two dumbbells (any weight)"], [1, "Just one", "We'll stick to one-dumbbell moves"], [0, "None yet", "Body-weight moves only"]] },
  ];
  const SKIPS = [["jump", "Jumping"], ["kneel", "Kneeling / all fours"], ["floor", "Lying on the floor"], ["lunge", "Lunges"], ["overhead", "Weights overhead"], ["balance", "One-leg balance"]];
  let wz: WizardState | null = null;
  function openWizard() {
    stopPreview();
    const prev = plan ? plan.answers : store.get("planAnswers", null);
    wz = { step: 0, cur: 0, answers: { level: "back", focus: "balanced", perWeek: 4, dumbbells: 2, moves: 5, skip: [], variety: "weekly", ...(prev || {}) }, draft: null };
    show("wizard");
    document.documentElement.style.setProperty("--accent", PLAN_CARD.color);
    sfx("start");
    wzSyncCur();
    renderWizard();
  }
  function wzSyncCur() {
    const q = QUESTIONS[wz.step];
    if (q) wz.cur = Math.max(0, q.options.findIndex((o) => o[0] === wz.answers[q.id]));
  }
  function wzPick(i) {
    const q = QUESTIONS[wz.step];
    wz.answers[q.id] = q.options[i][0];
    wz.cur = i;
    sfx("tick");
    wzGo(1);
  }
  function wzGo(dir) {
    const last = QUESTIONS.length; // the summary step
    const nextStep = wz.step + dir;
    if (nextStep < 0) { closeWizard(); return; }
    if (nextStep > last) { savePlanFromWizard(); return; }
    wz.step = nextStep;
    if (wz.step === last) wzBuild(); else wzSyncCur();
    sfx("move");
    renderWizard();
  }
  function wzBuild() {
    wz.draft = PL.generate({ ...wz.answers, likes: favs(), dislikes: nope() });
  }
  function closeWizard() { wz = null; show("home"); renderHome(); }
  function savePlanFromWizard() {
    plan = wz.draft;
    store.set("planAnswers", wz.answers);
    savePlan();
    focus = 0; focusSet = true;
    wz = null;
    show("home"); renderHome();
    flash("PLAN SAVED");
  }
  function useClassic() {
    plan = null;
    store.set("plan", null);
    focus = suggestedDay() - 1; focusSet = true;
    wz = null;
    show("home"); renderHome();
    flash("CLASSIC DAYS 1–4");
  }
  function renderWizard() {
    const total = QUESTIONS.length;
    $("wzPips").innerHTML = Array.from({ length: total + 1 }, (_, i) => `<span class="${i < wz.step ? "done" : i === wz.step ? "now" : ""}"></span>`).join("");
    const q = QUESTIONS[wz.step];
    if (q) {
      $("wzBody").innerHTML = `
        <div class="wz-q">
          <div class="wz-count">Question ${wz.step + 1} of ${total}</div>
          <h1>${q.title}</h1>
          <div class="wz-opts n${q.options.length}">${q.options.map(([v, label, desc], i) => `
            <button class="wz-opt${i === wz.cur ? " cur" : ""}${wz.answers[q.id] === v ? " on" : ""}" data-i="${i}">
              <kbd>${i + 1}</kbd><b>${label}</b><span>${desc}</span>
            </button>`).join("")}
          </div>
        </div>`;
      $("wzBody").querySelectorAll<UIElement>(".wz-opt").forEach((b) => (b.onclick = () => wzPick(+b.dataset.i)));
      $("wzKeys").innerHTML = `<span><kbd>◀</kbd><kbd>▶</kbd> Choose</span><span><kbd>Enter</kbd> Next</span><span><kbd>1</kbd>–<kbd>${q.options.length}</kbd> Pick</span><span><kbd>Backspace</kbd> Back</span>`;
      return;
    }
    // summary
    const d = wz.draft, a = wz.answers;
    const split = a.perWeek >= 4;
    $("wzBody").innerHTML = `
      <div class="wz-sum">
        <div class="wz-count">Your plan</div>
        <h1>${d.days.length} workouts, ${a.moves} moves each</h1>
        <p class="wz-note">${split ? "Lower-body and upper-body days take turns, so muscles get a day off in between." : "Each workout covers the whole body with different moves."}
          Do them in order, as often as you like. Every week a couple of moves get swapped so it stays fresh.</p>
        <div class="wz-days">${d.days.map((x) => `
          <div class="wz-day" style="--c:${x.color}">
            <div class="wz-dh"><span>${x.n}</span><b>${x.title}</b><em>~${estMinutes(x.moves.length, settings.rounds)} min</em></div>
            <ol>${x.moves.map((k) => `<li>${EX[k].name}</li>`).join("")}</ol>
          </div>`).join("")}
        </div>
        <div class="wz-skip"><span>Optional: leave out</span>${SKIPS.map(([f, label]) => `<button class="chip${a.skip.includes(f) ? " on" : ""}" data-f="${f}">${label}</button>`).join("")}</div>
        <div class="wz-actions">
          <button class="hud-btn" id="wzShuffle">↻ Reshuffle <kbd>R</kbd></button>
          ${plan || history().length ? `<button class="hud-btn" id="wzClassic">Use classic Days 1–4 <kbd>C</kbd></button>` : ""}
          <button class="big-btn" id="wzSave">Save plan <kbd>Enter</kbd></button>
        </div>
        <p class="wz-learn">After each workout you'll rate how it felt, and ♥ or skip moves. The plan adjusts as you go.</p>
      </div>`;
    $("wzBody").querySelectorAll<UIElement>(".chip").forEach((b) => (b.onclick = () => {
      const f = b.dataset.f, i = a.skip.indexOf(f);
      i >= 0 ? a.skip.splice(i, 1) : a.skip.push(f);
      sfx("tick"); wzBuild(); renderWizard();
    }));
    $("wzShuffle").onclick = () => { sfx("tick"); wzBuild(); renderWizard(); };
    $("wzSave").onclick = savePlanFromWizard;
    if ($("wzClassic")) $("wzClassic").onclick = useClassic;
    $("wzKeys").innerHTML = `<span><kbd>R</kbd> Reshuffle</span><span><kbd>Enter</kbd> Save plan</span><span><kbd>Backspace</kbd> Back</span>`;
  }
  function wizardKey(e) {
    const k = e.key, q = QUESTIONS[wz.step];
    const act = q ? {
      ArrowLeft: () => { wz.cur = (wz.cur - 1 + q.options.length) % q.options.length; sfx("move"); renderWizard(); },
      ArrowRight: () => { wz.cur = (wz.cur + 1) % q.options.length; sfx("move"); renderWizard(); },
      ArrowUp: () => { wz.cur = (wz.cur - 1 + q.options.length) % q.options.length; sfx("move"); renderWizard(); },
      ArrowDown: () => { wz.cur = (wz.cur + 1) % q.options.length; sfx("move"); renderWizard(); },
      Enter: () => wzPick(wz.cur), " ": () => wzPick(wz.cur),
      Backspace: () => wzGo(-1), Escape: closeWizard,
    }[k] : {
      r: () => { sfx("tick"); wzBuild(); renderWizard(); }, R: () => { sfx("tick"); wzBuild(); renderWizard(); },
      c: () => (plan || history().length) && useClassic(), C: () => (plan || history().length) && useClassic(),
      Enter: savePlanFromWizard, Backspace: () => wzGo(-1), Escape: closeWizard,
    }[k];
    if (act) { e.preventDefault(); act(); return; }
    if (q && /^[1-9]$/.test(k) && +k <= q.options.length) { e.preventDefault(); wzPick(+k - 1); }
  }

  // ---------- after a workout: how did it feel? ----------
  const FEEL = [["easy", "Too easy"], ["right", "Just right"], ["hard", "Too hard"]];
  let feelOffer = null;
  function renderFeel(picked) {
    $("feelBtns").innerHTML = FEEL.map(([v, label], i) => `<button class="feel-btn${picked === v ? " on" : ""}" data-v="${v}"><kbd>${i + 1}</kbd> ${label}</button>`).join("");
    $("feelBtns").querySelectorAll<UIElement>(".feel-btn").forEach((b) => (b.onclick = () => rateFeel(b.dataset.v)));
    feelOffer = picked ? offerFor(picked) : null;
    $("feelTip").innerHTML = feelOffer ? `${feelOffer.text} <button class="hud-btn" id="feelYes">${feelOffer.label} <kbd>Y</kbd></button>` : picked === "right" ? "Nice. We'll keep it right here." : "";
    if (feelOffer) $("feelYes").onclick = acceptOffer;
  }
  function rateFeel(v) {
    const h = history();
    if (!h.length) return;
    h[h.length - 1].feel = v;
    store.set("history", h);
    sfx("tick");
    renderFeel(v);
  }
  function offerFor(v) {
    const lvl = plan ? plan.answers.level : null, LV = ["new", "back", "regular"];
    if (v === "easy") {
      if (settings.rounds < 3) return { text: `Ready for more?`, label: `Do ${settings.rounds + 1} rounds next time`, act: () => { settings.rounds++; save("rounds"); } };
      if (plan && lvl !== "regular") return { text: "Ready for harder moves?", label: "Use harder variations", act: () => { plan.answers.level = LV[LV.indexOf(lvl) + 1]; rebuildPlan(); } };
    }
    if (v === "hard") {
      if (settings.rounds > 1) return { text: "Let's ease off.", label: `Go back to ${settings.rounds - 1} round${settings.rounds > 2 ? "s" : ""}`, act: () => { settings.rounds--; save("rounds"); } };
      if (plan && lvl !== "new") return { text: "Let's ease off.", label: "Use simpler moves", act: () => { plan.answers.level = LV[LV.indexOf(lvl) - 1]; rebuildPlan(); } };
      if (settings.rest < 45) return { text: "Take it slower.", label: "Rest 45 s between moves", act: () => { settings.rest = 45; save("rest"); } };
    }
    return null;
  }
  function rebuildPlan() {
    const keepId = plan.id;
    plan = PL.generate({ ...plan.answers, likes: favs(), dislikes: nope() });
    plan.id = keepId; // same rotation, so "up next" carries on
    savePlan();
  }
  function acceptOffer() {
    if (!feelOffer) return;
    feelOffer.act();
    sfx("start");
    $("feelTip").textContent = "Done! It'll be ready next time.";
    feelOffer = null;
  }


  // ---------- CALENDAR: what you did, month by month ----------
  const weekGoal = () => (plan ? plan.answers.perWeek : 4);
  // older history entries lack title/color: fill them from the classic days
  function entryInfo(x) {
    const d = typeof x.day === "number" && !x.prog ? DAYS[x.day - 1] : null;
    return { title: x.title || (x.custom ? x.custom : d ? `Day ${d.n} · ${d.title}` : "Workout"), color: x.color || (d ? d.color : "#f5b82e") };
  }
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  function byDay() {
    const m = new Map();
    for (const x of history()) { const k = ymd(new Date(x.date)); if (!m.has(k)) m.set(k, []); m.get(k).push(x); }
    return m;
  }
  const monday = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
  function weeksOnTarget(days) {
    // consecutive weeks hitting the goal; this week counts once it's hit, and doesn't break the run before then
    let n = 0, wk = monday(new Date());
    const count = (start) => { let c = 0; for (let i = 0; i < 7; i++) { const d = new Date(start); d.setDate(d.getDate() + i); if (days.has(ymd(d))) c++; } return c; };
    if (count(wk) >= weekGoal()) n++;
    for (;;) { wk.setDate(wk.getDate() - 7); if (count(wk) >= weekGoal()) n++; else break; }
    return n;
  }
  let calMonth = null, calSel = null;
  function openCalendar() {
    stopPreview();
    const now = new Date();
    calMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    calSel = ymd(now);
    show("calendar");
    document.documentElement.style.setProperty("--accent", "#2be38f");
    sfx("start");
    renderCalendar();
  }
  function calShift(n) { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + n, 1); sfx("move"); renderCalendar(); }
  function renderCalendar() {
    const days = byDay(), today = ymd(new Date()), h = history();
    $("calTitle").textContent = calMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    const start = monday(calMonth);
    let cells = "";
    for (let i = 0; i < 42; i++) {
      const d = new Date(start); d.setDate(d.getDate() + i);
      if (i === 35 && d.getMonth() !== calMonth.getMonth()) break;
      const k = ymd(d), list = days.get(k) || [];
      cells += `<button class="cday${d.getMonth() !== calMonth.getMonth() ? " out" : ""}${k === today ? " today" : ""}${k === calSel ? " sel" : ""}${list.length ? " did" : ""}" data-k="${k}">
        <span class="cnum">${d.getDate()}</span>
        ${list.map((x) => { const e = entryInfo(x); return `<span class="cchip" style="--c:${e.color}">${e.title.replace(/^Day \d+ · /, "")}</span>`; }).join("")}
      </button>`;
    }
    $("calGrid").innerHTML = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => `<div class="cwd">${w}</div>`).join("") + cells;
    $("calGrid").querySelectorAll<UIElement>(".cday").forEach((b) => (b.onclick = () => { calSel = b.dataset.k; sfx("tick"); renderCalendar(); }));

    // stats
    const wk = monday(new Date());
    let thisWeek = 0;
    for (let i = 0; i < 7; i++) { const d = new Date(wk); d.setDate(d.getDate() + i); if (days.has(ymd(d))) thisWeek++; }
    const inMonth = h.filter((x) => { const d = new Date(x.date); return d.getMonth() === calMonth.getMonth() && d.getFullYear() === calMonth.getFullYear(); });
    const mins = inMonth.reduce((t, x) => t + (x.minutes || 0), 0);
    const goal = weekGoal();
    const feels = h.filter((x) => x.feel).slice(-10);
    const fc = (v) => feels.filter((x) => x.feel === v).length;
    $("calStats").innerHTML = `
      <div class="cgoal">
        <div class="cgoal-h"><b>This week</b><span>${thisWeek} of ${goal} days</span></div>
        <div class="cgoal-bar">${Array.from({ length: goal }, (_, i) => `<i class="${i < thisWeek ? "on" : ""}"></i>`).join("")}</div>
      </div>
      <div class="cstats">
        <div class="stat"><b>${streak()}</b><span>day streak</span></div>
        <div class="stat"><b>${weeksOnTarget(days)}</b><span>weeks on goal</span></div>
        <div class="stat"><b>${inMonth.length}</b><span>this month</span></div>
        <div class="stat"><b>${mins}</b><span>minutes this month</span></div>
        <div class="stat"><b>${h.length}</b><span>all-time</span></div>
        <div class="stat"><b>${settings.rounds}</b><span>rounds now</span></div>
      </div>
      ${feels.length ? `<div class="cfeel"><b>How the last ${feels.length} felt</b>
        <div class="cfeel-bar">${feels.map((x) => `<i class="f-${x.feel}" title="${x.feel}"></i>`).join("")}</div>
        <span>${fc("easy")} too easy · ${fc("right")} just right · ${fc("hard")} too hard</span></div>` : ""}
      <div class="csel">
        <b>${new Date(calSel + "T12:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</b>
        ${(days.get(calSel) || []).map((x) => { const e = entryInfo(x); return `<div class="crow" style="--c:${e.color}"><span>${e.title}</span><em>${x.rounds} round${x.rounds > 1 ? "s" : ""} · ${Math.max(1, x.minutes || 0)} min${x.feel ? " · " + { easy: "too easy", right: "just right", hard: "too hard" }[x.feel] : ""}</em></div>`; }).join("") || `<div class="cnone">${calSel === today ? "Nothing yet today. Let's go!" : "Rest day"}</div>`}
      </div>`;
  }

  // ---------- start-screen preview player (focused panel only) ----------
  let preview: YT.Player | null = null, previewTimer: number | null = null, previewIdx = 0, previewGen = 0;
  function stopPreview() {
    clearTimeout(previewTimer);
    previewGen++;
    if (preview) { try { preview.destroy(); } catch {} preview = null; }
    document.querySelectorAll<UIElement>(".p-vid").forEach((v) => { v.innerHTML = ""; v.classList.remove("live"); });
    document.querySelectorAll<UIElement>(".p-moves li").forEach((li) => li.classList.remove("on"));
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
      p.querySelector<UIElement>(".p-vid").appendChild(holder);
      preview = new YT.Player(holder, {
        host: "https://www.youtube-nocookie.com",
        videoId: previewVideo(day.moves[0]).id,
        playerVars: { autoplay: 1, mute: 1, controls: 0, rel: 0, playsinline: 1, modestbranding: 1, iv_load_policy: 3, disablekb: 1, fs: 0, loop: 1, playlist: previewVideo(day.moves[0]).id },
        events: {
          onReady: (ev) => { if (gen === previewGen) { ev.target.mute(); ev.target.playVideo(); } },
          onStateChange: (ev) => {
            if (gen !== previewGen) return;
            const vid = p.querySelector<UIElement>(".p-vid");
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
    const vid = p.querySelector<UIElement>(".p-vid");
    vid.classList.remove("live");
    setImg(p.querySelector<UIElement>(".p-photo"), v);
    markPreviewMove(p, previewIdx);
    setTimeout(() => { if (gen === previewGen && preview) preview.loadVideoById(v.id); }, 350);
  }
  function markPreviewMove(p, j) {
    p.querySelectorAll<UIElement>(".p-moves li").forEach((li) => li.classList.toggle("on", +li.dataset.j === j));
  }

  // ---------- SESSION ----------
  let S: WorkoutSession | null = null;
  function buildSteps(day, rounds) {
    const moves = day.moves, steps: WorkoutStep[] = [];
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
    const d0 = typeof n === "object" ? n : program().find((d) => d.n === n);
    const day = { ...d0, moves: [...d0.moves] }; // plan edits mid-workout don't reshuffle the running session
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
    $("tDay").textContent = S.day.custom ? `À la carte · ${S.day.custom}` : `${plan ? "Workout" : "Day"} ${S.day.n} · ${S.day.title}`;
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
    document.querySelectorAll<UIElement>("#progress .dot").forEach((d) => {
      const j = +d.dataset.j;
      d.className = "dot" + (j < S.i ? " done" : j === S.i ? " now" : "");
    });
    renderTimer();
    renderPause();
    renderFavBtn();
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
    h.push({ day: S.day.custom ? null : S.day.n, prog: S.day.custom ? null : progId(), custom: S.day.custom, title: S.day.title, color: S.day.color,
      moves: S.day.moves.length, rounds: S.rounds, date: new Date().toISOString(), minutes: Math.round((Date.now() - S.started) / 60000) });
    store.set("history", h.slice(-500));
    // "new moves every time" plans re-roll a workout once it's done
    if (plan && !S.day.custom && plan.answers.variety === "fresh") {
      const i = plan.days.findIndex((d) => d.n === S.day.n);
      if (i >= 0) { PL.regenerateDay(plan, i); savePlan(); }
    }
    beep(523, 0.15); setTimeout(() => beep(659, 0.15), 160); setTimeout(() => beep(784, 0.3), 320);
    endSession();
    $("doneTitle").textContent = S.day.custom ? `${S.day.custom} done!` : plan ? `${S.day.title} done!` : `Day ${S.day.n} done!`;
    const mins = Math.max(1, Math.round((Date.now() - S.started) / 60000));
    $("doneSub").textContent = `${S.rounds} round${S.rounds > 1 ? "s" : ""} of ${S.day.title} in about ${mins} minute${mins > 1 ? "s" : ""}.`;
    const st = streak();
    const nx = program()[suggestedDay() - 1];
    $("doneNext").textContent = `${st > 1 ? `🔥 ${st}-day streak · ` : ""}Next time: ${plan ? "Workout" : "Day"} ${nx.n} — ${nx.title}`;
    if (!S.day.custom) focus = suggestedDay() - 1;
    renderFeel(null);
    show("done");
  }

  const curMove = () => { const st = S.steps[S.i]; return st.type === "rest" ? st.next : st.key; };
  function favCurrent() { const on = toggleFav(curMove()); flash(on ? "♥ SAVED" : "♥ REMOVED"); renderFavBtn(); }
  function renderFavBtn() { if (!S) return; const on = favs().includes(curMove()); $("favIc").textContent = on ? "♥" : "♡"; $("favBtn").classList.toggle("on", on); }
  function nopeCurrent() {
    const k = curMove();
    if (!confirm(`Never show "${EX[k].name}" again?`)) return;
    notForMe(k);
    flash("WON'T SHOW AGAIN");
    const st = S.steps[S.i];
    if (st.type === "work") next();
  }
  function flash(text) {
    const f = document.createElement("div");
    f.className = "flash";
    f.textContent = text;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1600);
  }

  // ---------- YouTube ----------
  let ytResolve!: () => void;
  const ytReady = new Promise<void>((r) => (ytResolve = r));
  let player: YT.Player | null = null, playerReady = false, pendingVideo: ExerciseVideo | null = null;
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
  let wakeLock: WakeLockSentinel | null = null;
  async function requestWakeLock() { try { wakeLock = await navigator.wakeLock?.request("screen"); } catch {} }
  function releaseWakeLock() { try { wakeLock?.release(); } catch {} wakeLock = null; }
  document.addEventListener("visibilitychange", () => { if (view === "session" && document.visibilityState === "visible") requestWakeLock(); });

  let actx: AudioContext | null = null;
  function unlockAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); } catch {} }
  function beep(freq: number, dur: number, vol = 0.35, type: OscillatorType = "sine", toFreq?: number) {
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
    if ((e.target as HTMLElement).tagName === "INPUT" || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (view === "home") {
      if (sheetOpen()) {
        if (k === "Escape" || k === "s" || k === "S") { e.preventDefault(); toggleSheet(false); }
        return;
      }
      const act = {
        p: openWizard, P: openWizard, c: openCalendar, C: openCalendar,
        ArrowLeft: () => setFocus(focus - 1, -1), ArrowRight: () => setFocus(focus + 1, 1),
        ArrowUp: () => setRounds(settings.rounds + 1), ArrowDown: () => setRounds(settings.rounds - 1),
        Enter: () => activate(focus), " ": () => activate(focus),
        s: () => toggleSheet(true), S: () => toggleSheet(true),
      }[k];
      if (act) { e.preventDefault(); act(); }
      else if (/^[1-9]$/.test(k) && +k <= CARDS.length) { e.preventDefault(); setFocus(+k - 1, 1); }
      return;
    }
    if (view === "menu") {
      if (pickerOpen()) {
        if (k === "Escape" || k === "Enter") { e.preventDefault(); closePicker(); }
        else if (k === "/") { e.preventDefault(); $("pickSearch").focus(); }
        return;
      }
      const act = {
        a: openPicker, A: openPicker,
        ArrowUp: () => selectArea(menuArea - 1), ArrowDown: () => selectArea(menuArea + 1),
        ArrowLeft: () => selectArea(menuArea - 1), ArrowRight: () => selectArea(menuArea + 1),
        r: reshuffle, R: reshuffle, Enter: startMenuSet, " ": startMenuSet, s: saveSet, S: saveSet, Delete: deleteSet,
        Escape: () => { show("home"); renderHome(); }, Backspace: () => { show("home"); renderHome(); },
      }[k];
      if (act) { e.preventDefault(); act(); }
      else if (/^[1-3]$/.test(k)) { e.preventDefault(); settings.rounds = +k; save("rounds"); sfx("tick"); renderMenu(); }
      return;
    }
    if (view === "wizard") { wizardKey(e); return; }
    if (view === "calendar") {
      const act = { ArrowLeft: () => calShift(-1), ArrowRight: () => calShift(1), t: () => openCalendar(), T: () => openCalendar(),
        Escape: () => { show("home"); renderHome(); }, Backspace: () => { show("home"); renderHome(); }, c: () => { show("home"); renderHome(); }, C: () => { show("home"); renderHome(); } }[k];
      if (act) { e.preventDefault(); act(); }
      return;
    }
    if (view === "done") {
      if (k === "Enter" || k === "Escape" || k === " ") { e.preventDefault(); show("home"); renderHome(); }
      else if (/^[1-3]$/.test(k)) { e.preventDefault(); rateFeel(FEEL[+k - 1][0]); }
      else if (k === "y" || k === "Y") { e.preventDefault(); acceptOffer(); }
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
      h: favCurrent, H: favCurrent, x: nopeCurrent, X: nopeCurrent,
    };
    if (map[k]) { e.preventDefault(); map[k](); }
  });
  const DOUBLE_TAP_MS = 400;
  let lastSpace = 0;
  // Keep keyboard focus out of buttons so Space/Enter always go to our handler.
  document.addEventListener("click", (e) => { const b = (e.target as HTMLElement).closest("button"); if (b) b.blur(); });

  $("shield").onclick = togglePause;
  $("pauseBtn").onclick = togglePause;
  $("nextBtn").onclick = next;
  $("backBtn").onclick = back;
  $("soundBtn").onclick = toggleSound;
  $("altBtn").onclick = otherVideo;
  $("fsBtn").onclick = toggleFullscreen;
  $("favBtn").onclick = favCurrent;
  $("nopeBtn").onclick = nopeCurrent;
  $("wzBack").onclick = () => wzGo(-1);
  $("quitBtn").onclick = quit;
  $("homeBtn").onclick = () => { show("home"); renderHome(); };
  $("settingsBtn").onclick = () => toggleSheet(true);
  $("planBtn").onclick = openWizard;
  $("calBtn").onclick = openCalendar;
  $("stats").onclick = openCalendar;
  $("calBack").onclick = () => { show("home"); renderHome(); };
  $("calPrev").onclick = () => calShift(-1);
  $("calNext").onclick = () => calShift(1);
  $("menuBack").onclick = () => { show("home"); renderHome(); };
  $("shuffleBtn").onclick = reshuffle;
  $("saveSetBtn").onclick = saveSet;
  $("delSetBtn").onclick = deleteSet;
  $("setStart").onclick = startMenuSet;
  $("sheetClose").onclick = () => toggleSheet(false);
  $("sheet").addEventListener("click", (e) => { if ((e.target as HTMLElement).id === "sheet") toggleSheet(false); });

  renderHome();
  if (!plan && !history().length && !store.get("wizardSeen", false)) { store.set("wizardSeen", true); openWizard(); }
  setInterval(tick, 100);

  // exposed for quick testing in the console
  window.__workout = {
    get state() { return S; }, get player() { return player; }, get preview() { return preview; }, get focus() { return focus; },
    startSession, next, back, togglePause, setFocus, buildSet, poolFor, openMenu, get menuSet() { return menuSet; },
    openWizard, openCalendar, get wz() { return wz; }, get plan() { return plan; }, get cards() { return CARDS; },
  };
})();
