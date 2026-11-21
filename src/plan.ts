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
  const FLAGS: Record<string, string[]> = {
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
  const T: Record<string, PlanTemplate> = {
    fullA:  { title: "Full Body A", color: "#22c38e", slots: [["squat", "lunge"], ["push"], ["hinge", "bridge"], ["pull"], ["core"], ["side", "arms"]] },
    fullB:  { title: "Full Body B", color: "#3b82f6", slots: [["hinge"], ["pull"], ["lunge", "squat"], ["push"], ["side", "kickback", "core"], ["arms"]] },
    fullC:  { title: "Full Body C", color: "#8a5cf6", slots: [["bridge"], ["push"], ["lunge"], ["pull"], ["core"], ["kickback", "side"]] },
    butt:   { title: "Butt", color: "#e8336b", slots: [["squat", "lunge"], ["hinge"], ["lunge", "squat"], ["bridge"], ["side"], ["kickback"]] },
    butt2:  { title: "Butt", color: "#ff5c8a", slots: [["hinge"], ["lunge"], ["bridge"], ["kickback"], ["side"], ["squat"]] },
    legs:   { title: "Legs", color: "#f08a24", slots: [["squat"], ["hinge"], ["lunge"], ["bridge"], ["side"], ["core"]] },
    upper:  { title: "Upper Body", color: "#8a5cf6", slots: [["push"], ["pull"], ["push"], ["pull"], ["arms"], ["core"]] },
    upper2: { title: "Arms + Core", color: "#3b82f6", slots: [["pull"], ["arms"], ["push"], ["core"], ["arms"], ["core"]] },
    lowerCore: { title: "Lower + Core", color: "#14a39a", slots: [["bridge"], ["core"], ["squat", "lunge"], ["core"], ["side", "kickback"], ["hinge"]] },
    // Balanced 3-day split: each day owns its own muscles, the three together cover the whole body.
    // A slot entry "pattern/muscle" only accepts moves of that pattern whose main muscles include that muscle.
    splitLegs: { title: "Legs + Hips", color: "#22c38e", slots: [["squat"], ["lunge"], ["side"], ["lunge", "squat"], ["side"], ["squat"]] },
    splitPush: { title: "Chest + Shoulders", color: "#3b82f6", slots: [["push/chest"], ["push/shoulders"], ["arms/triceps"], ["core"], ["push"], ["core"]] },
    // without a pair of dumbbells there are no chest or shoulder moves, so the upper day becomes core + arms
    splitCore: { title: "Core + Arms", color: "#3b82f6", slots: [["core"], ["arms/triceps"], ["core"], ["arms/biceps"], ["core"], ["kickback/erectors"]] },
    // with no dumbbells at all there are no upper-body moves, so the days split legs / glutes + core / mixed
    glutesCore: { title: "Glutes + Core", color: "#8a5cf6", slots: [["bridge"], ["core"], ["kickback"], ["core"], ["bridge"], ["kickback"]] },
    splitPull: { title: "Back + Glutes", color: "#8a5cf6", slots: [["hinge"], ["pull"], ["bridge"], ["arms/biceps"], ["pull"], ["kickback"]] },
  };
  // Rotations per focus. With 4+ days, lower and upper alternate so the same muscles get a rest day between.
  const ROTATIONS: Record<PlanFocus, (n: number) => string[]> = {
    balanced: (n) => (n <= 2 ? ["legs", "upper"] : n === 3 ? ["splitLegs", "splitPush", "splitPull"] : ["butt", "upper", "legs", "upper2", "fullA", "lowerCore"]),
    booty:    (n) => (n <= 3 ? ["butt", "fullA", "butt2"] : ["butt", "upper", "butt2", "lowerCore", "butt", "upper2"]),
    lower:    (n) => (n <= 3 ? ["legs", "butt", "fullB"] : ["legs", "upper", "butt", "lowerCore", "butt2", "upper2"]),
    upper:    (n) => (n <= 3 ? ["upper", "fullA", "upper2"] : ["upper", "legs", "upper2", "fullB", "upper", "butt"]),
  };

  const shuffle = <T>(xs: T[]): T[] => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // Hard rules: dumbbells owned and moves to skip. Level is soft: prefer at or below, allow one above if nothing else fits.
  function allowed(k: string, a: PlanAnswers): boolean {
    const e = EX[k];
    if (e.dumbbells > a.dumbbells) return false;
    if (e.flags.some((f) => (a.skip || []).includes(f))) return false;
    if ((a.dislikes || []).includes(k)) return false;
    return true;
  }
  const maxLevel = (a: PlanAnswers): number => ({ new: 1, back: 2, regular: 3 }[a.level] || 2);

  // Pick one move for a slot. `used` = already in this workout, `seen` = used elsewhere in the plan (soft avoid).
  // A pattern spec is "pattern" or "pattern/muscle", where muscle is a muscle id or a muscle group id
  // (see muscles.ts) that must be among the move's main muscles.
  const MUS = window.MUSCLES;
  const fits = (k: string, spec: string): boolean => {
    const [pat, muscle] = spec.split("/");
    return EX[k].pattern === pat && (!muscle || EX[k].primary.some((m) => m === muscle || MUS[m].group === muscle));
  };
  function pickSlot(patterns: string[], a: PlanAnswers, used: Set<string>, seen: Map<string, number>, avoid = new Set<string>()): string | null {
    const ok = Object.keys(EX).filter((k) => !used.has(k) && patterns.some((p) => fits(k, p)) && allowed(k, a));
    if (!ok.length) return null;
    const lvl = maxLevel(a);
    const havePat = new Set([...used].map((x) => EX[x].pattern));
    const score = (k) => (havePat.has(EX[k].pattern) ? 25 : 0) +
      (EX[k].level <= lvl ? 0 : (EX[k].level - lvl) * 20) + (avoid.has(k) ? 30 : 0) + (seen.get(k) || 0) * 12 + Math.random() * 10 - ((a.likes || []).includes(k) ? 14 : 0);
    return ok.sort((x, y) => score(x) - score(y))[0];
  }

  function buildWorkout(tplId: string, a: PlanAnswers, seen: Map<string, number>, avoid?: Set<string>): string[] {
    const tpl = T[tplId], used = new Set<string>(), moves: string[] = [];
    // slots in template order; the first ones are the most important
    const slots = Array.from({ length: a.moves }, (_, i) => tpl.slots[i % tpl.slots.length]);
    for (const pats of slots) {
      const k = pickSlot(pats, a, used, seen, avoid);
      if (k) { used.add(k); moves.push(k); seen.set(k, (seen.get(k) || 0) + 1); }
    }
    // a slot with no allowed move (say no dumbbells, or floor moves left out) is topped up from the day's own
    // patterns first, then from anything allowed
    const own = [...new Set(tpl.slots.flat())];
    const any = [...new Set(Object.values(EX).map((e) => e.pattern))];
    while (moves.length < a.moves) {
      const k = pickSlot(own, a, used, seen, avoid) || pickSlot(any, a, used, seen, avoid);
      if (!k) break;
      used.add(k); moves.push(k); seen.set(k, (seen.get(k) || 0) + 1);
    }
    return moves;
  }

  function rotationFor(a: PlanAnswers): string[] {
    const n = Math.min(Math.max(a.perWeek || 3, 2), 6);
    const r = ROTATIONS[a.focus](n).slice(0, n);
    if (r.includes("splitPush") && a.dumbbells < 2) {
      return a.dumbbells < 1 ? ["splitLegs", "glutesCore", "fullA"] : r.map((t) => (t === "splitPush" ? "splitCore" : t));
    }
    return r;
  }

  function generate(a: PlanAnswers): WorkoutPlan {
    const seen = new Map<string, number>();
    const tpls = rotationFor(a);
    const id = "p" + Date.now().toString(36);
    const days = tpls.map((t, i) => ({ n: i + 1, tpl: t, title: T[t].title, color: T[t].color, moves: buildWorkout(t, a, seen) }));
    // give repeated template titles a letter so the cards are tellable apart
    const count: Record<string, number> = {};
    days.forEach((d) => (count[d.title] = (count[d.title] || 0) + 1));
    const nth: Record<string, number> = {};
    days.forEach((d) => { if (count[d.title] > 1) { nth[d.title] = (nth[d.title] || 0) + 1; d.title += " " + "ABCDEF"[nth[d.title] - 1]; } });
    return { id, answers: a, days, week: weekKey(new Date()), created: new Date().toISOString() };
  }

  // Fresh moves for one workout, avoiding what it had last time.
  function regenerateDay(plan: WorkoutPlan, i: number): void {
    const d = plan.days[i], seen = new Map();
    plan.days.forEach((x, j) => { if (j !== i) x.moves.forEach((k) => seen.set(k, 1)); });
    d.moves = buildWorkout(d.tpl, plan.answers, seen, new Set(d.moves));
  }

  // Swap two moves per workout for a same-pattern alternative.
  function weeklySwap(plan: WorkoutPlan): void {
    for (const d of plan.days) {
      for (const j of shuffle(d.moves.map((_, j) => j)).slice(0, 2)) {
        const used = new Set(d.moves);
        // same pattern and same main muscles, so a split day keeps its focus (a triceps move stays a triceps move)
        const old = EX[d.moves[j]];
        const k = pickSlot(old.primary.map((m) => old.pattern + "/" + m), plan.answers, used, new Map(), new Set());
        if (k) d.moves[j] = k;
      }
    }
  }

  function weekKey(date: Date): string {
    const d = new Date(date.getTime()); d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // back to Monday
    return d.toISOString().slice(0, 10);
  }

  window.PLANNER = { generate, regenerateDay, weeklySwap, weekKey, rotationFor, allowed, maxLevel, TEMPLATES: T, FLAGS };
})();
