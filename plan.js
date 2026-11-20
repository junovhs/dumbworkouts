// Personal plan generator. Loaded after library.js, before app.js.
// Pure functions: tags every exercise with a difficulty level and "skip" flags,
// then builds a rotation of workouts from wizard answers.
(() => {
  const EX = window.EXERCISES;

  // ---------- tags ----------
  // level: 1 = fine on day one, 2 = needs some control, 3 = harder (balance, power, deep range)
  const LEVEL1 = ["gluteBridge", "frogPump", "clamshell", "fireHydrant", "donkeyKick", "sideLyingLegRaise", "standingAbduction",
    "standingKickback", "proneLegLift", "deadBug", "birdDog", "sumoSquat", "gobletSquat", "lateralSquatWalk", "couchHipThrust",
    "sumoDeadlift", "kneelingSquat", "floorPress", "lateralRaise", "hammerCurl", "concentrationCurl", "oneArmRow", "rearDeltFly",
    "tricepsExtension", "suitcaseMarch", "marchingBridge", "dumbbellDeadlift", "bentOverRow", "floorFly", "russianTwist"];
  const LEVEL3 = ["jumpSquat", "bulgarianSplitSquat", "skaterSquat", "singleLegBoxSquat", "cossackSquat", "singleLegHipThrust",
    "sidePlankClam", "singleLegRdl", "walkingLunge"];
  // things people may want to leave out
  const FLAGS = {
    jump: ["jumpSquat"],
    kneel: ["birdDog", "kneelingSquat", "fireHydrant", "donkeyKick", "rainbowKick"],
    floor: ["gluteBridge", "floorPress", "floorFly", "deadBug", "singleLegBridge", "frogPump", "marchingBridge", "elevatedBridge",
      "clamshell", "sideLyingLegRaise", "sidePlankClam", "proneLegLift", "russianTwist", "birdDog", "donkeyKick", "fireHydrant", "rainbowKick"],
    lunge: ["reverseLunge", "splitSquat", "bulgarianSplitSquat", "curtsyLunge", "lateralLunge", "walkingLunge", "lungeKneeDrive",
      "skaterSquat", "singleLegBoxSquat", "cossackSquat", "stepUp"],
    overhead: ["overheadPress", "tricepsExtension"],
    balance: ["singleLegRdl", "skaterSquat", "singleLegBoxSquat", "bStanceRdl", "standingKickback", "standingAbduction", "rainbowKick"],
  };
  for (const [k, e] of Object.entries(EX)) {
    e.level = LEVEL1.includes(k) ? 1 : LEVEL3.includes(k) ? 3 : 2;
    e.flags = Object.keys(FLAGS).filter((f) => FLAGS[f].includes(k));
  }

  // ---------- day templates: each slot is a list of acceptable movement patterns ----------
  const T = {
    fullA:  { title: "Full Body A", color: "#22c38e", slots: [["squat", "lunge"], ["push"], ["hinge", "bridge"], ["pull"], ["core"], ["side", "arms"]] },
    fullB:  { title: "Full Body B", color: "#3b82f6", slots: [["hinge"], ["pull"], ["lunge", "squat"], ["push"], ["side", "kickback", "core"], ["arms"]] },
    fullC:  { title: "Full Body C", color: "#8a5cf6", slots: [["bridge"], ["push"], ["lunge"], ["pull"], ["core"], ["kickback", "side"]] },
    butt:   { title: "Butt", color: "#e8336b", slots: [["squat", "lunge"], ["hinge"], ["lunge", "squat"], ["bridge"], ["side"], ["kickback"]] },
    butt2:  { title: "Butt", color: "#ff5c8a", slots: [["hinge"], ["lunge"], ["bridge"], ["kickback"], ["side"], ["squat"]] },
    legs:   { title: "Legs", color: "#f08a24", slots: [["squat"], ["hinge"], ["lunge"], ["bridge"], ["side"], ["core"]] },
    upper:  { title: "Upper Body", color: "#8a5cf6", slots: [["push"], ["pull"], ["push"], ["pull"], ["arms"], ["core"]] },
    upper2: { title: "Arms + Core", color: "#3b82f6", slots: [["pull"], ["arms"], ["push"], ["core"], ["arms"], ["core"]] },
    lowerCore: { title: "Lower + Core", color: "#14a39a", slots: [["bridge"], ["core"], ["squat", "lunge"], ["core"], ["side", "kickback"], ["hinge"]] },
  };
  // Rotations per focus. With 4+ days, lower and upper alternate so the same muscles get a rest day between.
  const ROTATIONS = {
    balanced: (n) => (n <= 3 ? ["fullA", "fullB", "fullC"] : ["butt", "upper", "legs", "upper2", "fullA", "lowerCore"]),
    booty:    (n) => (n <= 3 ? ["butt", "fullA", "butt2"] : ["butt", "upper", "butt2", "lowerCore", "butt", "upper2"]),
    lower:    (n) => (n <= 3 ? ["legs", "butt", "fullB"] : ["legs", "upper", "butt", "lowerCore", "butt2", "upper2"]),
    upper:    (n) => (n <= 3 ? ["upper", "fullA", "upper2"] : ["upper", "legs", "upper2", "fullB", "upper", "butt"]),
  };

  const shuffle = (xs) => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // Hard rules: dumbbells owned and moves to skip. Level is soft: prefer at or below, allow one above if nothing else fits.
  function allowed(k, a) {
    const e = EX[k];
    if (e.dumbbells > a.dumbbells) return false;
    if (e.flags.some((f) => (a.skip || []).includes(f))) return false;
    if ((a.dislikes || []).includes(k)) return false;
    return true;
  }
  const maxLevel = (a) => ({ new: 1, back: 2, regular: 3 }[a.level] || 2);

  // Pick one move for a slot. `used` = already in this workout, `seen` = used elsewhere in the plan (soft avoid).
  function pickSlot(patterns, a, used, seen, avoid = new Set()) {
    const ok = Object.keys(EX).filter((k) => !used.has(k) && patterns.includes(EX[k].pattern) && allowed(k, a));
    if (!ok.length) return null;
    const lvl = maxLevel(a);
    const havePat = new Set([...used].map((x) => EX[x].pattern));
    const score = (k) => (havePat.has(EX[k].pattern) ? 25 : 0) +
      (EX[k].level <= lvl ? 0 : (EX[k].level - lvl) * 20) + (avoid.has(k) ? 30 : 0) + (seen.get(k) || 0) * 12 + Math.random() * 10 - ((a.likes || []).includes(k) ? 14 : 0);
    return ok.sort((x, y) => score(x) - score(y))[0];
  }

  function buildWorkout(tplId, a, seen, avoid) {
    const tpl = T[tplId], used = new Set(), moves = [];
    // slots in template order; the first ones are the most important
    const slots = Array.from({ length: a.moves }, (_, i) => tpl.slots[i % tpl.slots.length]);
    for (const pats of slots) {
      const k = pickSlot(pats, a, used, seen, avoid);
      if (k) { used.add(k); moves.push(k); seen.set(k, (seen.get(k) || 0) + 1); }
    }
    // a template with no allowed move for a slot (say upper body with no dumbbells) gets topped up from any area it allows
    while (moves.length < a.moves) {
      const k = pickSlot([...new Set(Object.values(EX).map((e) => e.pattern))], a, used, seen, avoid);
      if (!k) break;
      used.add(k); moves.push(k); seen.set(k, (seen.get(k) || 0) + 1);
    }
    return moves;
  }

  function rotationFor(a) {
    const n = Math.min(Math.max(a.perWeek || 3, 2), 6);
    return ROTATIONS[a.focus](n).slice(0, n);
  }

  function generate(a) {
    const seen = new Map();
    const tpls = rotationFor(a);
    const id = "p" + Date.now().toString(36);
    const days = tpls.map((t, i) => ({ n: i + 1, tpl: t, title: T[t].title, color: T[t].color, moves: buildWorkout(t, a, seen) }));
    // give repeated template titles a letter so the cards are tellable apart
    const count = {};
    days.forEach((d) => (count[d.title] = (count[d.title] || 0) + 1));
    const nth = {};
    days.forEach((d) => { if (count[d.title] > 1) { nth[d.title] = (nth[d.title] || 0) + 1; d.title += " " + "ABCDEF"[nth[d.title] - 1]; } });
    return { id, answers: a, days, week: weekKey(new Date()), created: new Date().toISOString() };
  }

  // Fresh moves for one workout, avoiding what it had last time.
  function regenerateDay(plan, i) {
    const d = plan.days[i], seen = new Map();
    plan.days.forEach((x, j) => { if (j !== i) x.moves.forEach((k) => seen.set(k, 1)); });
    d.moves = buildWorkout(d.tpl, plan.answers, seen, new Set(d.moves));
  }

  // Swap two moves per workout for a same-pattern alternative.
  function weeklySwap(plan) {
    for (const d of plan.days) {
      for (const j of shuffle(d.moves.map((_, j) => j)).slice(0, 2)) {
        const used = new Set(d.moves);
        const k = pickSlot([EX[d.moves[j]].pattern], plan.answers, used, new Map(), new Set());
        if (k) d.moves[j] = k;
      }
    }
  }

  function weekKey(date) {
    const d = new Date(date); d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // back to Monday
    return d.toISOString().slice(0, 10);
  }

  window.PLANNER = { generate, regenerateDay, weeklySwap, weekKey, rotationFor, allowed, maxLevel, TEMPLATES: T, FLAGS };
})();
