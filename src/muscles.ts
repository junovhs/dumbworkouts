// Muscle model. Loaded after library.js, before plan.js.
// Two layers, counted differently:
//  - 30 prime movers in 12 groups: the muscles that grow from sets and reps. A main muscle counts as 1 set, a secondary as ½.
//  - 8 stabilizer groups: small muscles that hold joints steady. Counted as covered or not, never as volume.
// Each prime mover has a size tier (1 = big movers, 2 = other major muscles, 3 = smaller ones); when the Coverage
// slider adds moves, bigger muscles get covered first.
(() => {
  // [id, name, scientific name, group, tier, menu area, body-map regions, what it does]
  const P: Array<[string, string, string, string, number, string, string[], string]> = [
    ["midChest", "Chest", "Pectoralis major, sternal head", "chest", 1, "chest", ["chest"], "Pushes the arms forward and brings them together. The main chest muscle in flat presses and flys."],
    ["upperChest", "Upper chest", "Pectoralis major, clavicular head", "chest", 2, "chest", ["chest"], "The top of the chest, below the collarbone. Works hardest when pressing up at an angle."],
    ["frontDelt", "Front shoulders", "Anterior deltoid", "shoulders", 2, "shoulders", ["front-deltoids"], "Raises the arm forward and overhead. Busy in every press."],
    ["sideDelt", "Side shoulders", "Lateral deltoid", "shoulders", 2, "shoulders", ["front-deltoids"], "Lifts the arm out to the side. Gives the shoulders their width; presses barely reach it."],
    ["rearDelt", "Rear shoulders", "Posterior deltoid", "shoulders", 3, "back", ["back-deltoids"], "Pulls the arm back and out. Balances all the pushing and helps posture."],
    ["lats", "Lats", "Latissimus dorsi", "back", 1, "back", ["upper-back"], "Pulls the arms down and back toward the hips, as in rowing or pulling yourself up."],
    ["midBack", "Mid back", "Rhomboids & middle trapezius", "back", 1, "back", ["upper-back"], "Squeezes the shoulder blades together. The posture muscles of the upper back."],
    ["upperTraps", "Traps", "Upper trapezius", "back", 2, "back", ["trapezius"], "Lifts and steadies the shoulders and supports the neck, especially when carrying weight."],
    ["erectors", "Lower back", "Spinal erectors", "back", 2, "core", ["lower-back"], "Hold the spine straight when you lean forward or lift something off the floor."],
    ["bicepsLong", "Biceps (outer)", "Biceps brachii, long head", "biceps", 3, "arms", ["biceps"], "Bends the elbow. Stretched most when the arm is behind the body, as in incline curls."],
    ["bicepsShort", "Biceps (inner)", "Biceps brachii, short head", "biceps", 3, "arms", ["biceps"], "Bends the elbow and turns the palm up. Works hardest with the arm in front, as in concentration curls."],
    ["brachialis", "Brachialis", "Brachialis & brachioradialis", "biceps", 3, "arms", ["biceps"], "Sits under the biceps and bends the elbow whatever the grip. Hammer curls hit it best."],
    ["tricepsLong", "Triceps (long head)", "Triceps brachii, long head", "triceps", 2, "arms", ["triceps"], "The biggest part of the triceps. Only fully stretched with the arms overhead."],
    ["tricepsLateral", "Triceps (outer)", "Triceps brachii, lateral & medial heads", "triceps", 3, "arms", ["triceps"], "Straighten the elbow. Do much of the work in presses."],
    ["forearmFlexors", "Forearms (palm side)", "Forearm flexors", "forearms", 3, "arms", ["forearm"], "Close the hand and curl the wrist. Hold onto the dumbbells."],
    ["forearmExtensors", "Forearms (top)", "Forearm extensors", "forearms", 3, "arms", ["forearm"], "Open the hand and lift the wrist. Balance grip work and protect the elbows."],
    ["abs", "Abs", "Rectus abdominis", "core", 2, "core", ["abs"], "Curl the trunk and keep the ribs and pelvis stacked so the back stays safe."],
    ["obliques", "Obliques", "Side abs", "core", 2, "core", ["obliques"], "Twist the torso and stop it bending sideways under a load."],
    ["gluteMax", "Glutes", "Gluteus maximus", "hips", 1, "butt", ["gluteal"], "Your biggest muscle. Drives the hips forward to stand up, climb stairs and push off."],
    ["gluteMed", "Side glutes", "Gluteus medius & minimus", "hips", 2, "butt", ["abductors"], "Keep your pelvis level on one leg and move the leg out to the side. Help knees track straight."],
    ["adductors", "Inner thighs", "Adductors", "hips", 2, "legs", ["adductor"], "Pull the legs together and steady the hips in squats and lunges."],
    ["hipFlexors", "Hip flexors", "Iliopsoas", "hips", 3, "legs", [], "Lift the knee toward the chest. Often tight from sitting, rarely trained on purpose."],
    ["vasti", "Quads", "Vastus muscles, front of thigh", "quads", 1, "legs", ["quadriceps"], "Straighten the knee. Do most of the work getting up out of a squat or chair."],
    ["rectusFemoris", "Quads (hip)", "Rectus femoris", "quads", 2, "legs", ["quadriceps"], "The one quad that also crosses the hip. Squats under-train it; knee drives and leg extensions reach it."],
    ["hamsHip", "Hamstrings", "Hamstrings, hip action", "hamstrings", 1, "legs", ["hamstring"], "Help the glutes straighten the hip, as in deadlifts and hinging."],
    ["hamsKnee", "Hamstrings (knee)", "Hamstrings, knee action", "hamstrings", 2, "legs", ["hamstring"], "Bend the knee, as in leg curls. Hinges barely reach this job."],
    ["gastrocnemius", "Calves", "Gastrocnemius", "lowerLeg", 3, "legs", ["calves"], "Point the foot with the knee straight. Power for jumping and pushing off."],
    ["soleus", "Calves (deep)", "Soleus", "lowerLeg", 3, "legs", ["left-soleus", "right-soleus"], "Point the foot with the knee bent. Does most of the work in walking and standing."],
    ["tibialis", "Shins", "Tibialis anterior", "lowerLeg", 3, "legs", [], "Lifts the toes. Protects knees and ankles and balances strong calves."],
    ["neck", "Neck", "Neck flexors & extensors", "neck", 3, "back", ["neck"], "Holds the head up and steady. Rarely trained directly."],
  ];
  window.MUSCLES = {};
  for (const [id, name, sci, group, tier, area, regions, does] of P) window.MUSCLES[id] = { name, sci, group, tier, area, regions, does };

  window.MUSCLE_GROUPS = {
    chest: "Chest", shoulders: "Shoulders", back: "Back", biceps: "Biceps", triceps: "Triceps", forearms: "Forearms",
    core: "Core", hips: "Hips", quads: "Quads", hamstrings: "Hamstrings", lowerLeg: "Lower legs", neck: "Neck",
  };

  window.STABILIZERS = {
    rotatorCuff: { name: "Rotator cuff", does: "Four small muscles that keep the shoulder joint centered. Challenged by one-arm presses, flys and rear-delt work." },
    scapular: { name: "Shoulder blades", does: "Serratus and lower traps hold the shoulder blades flat and moving well. Challenged by overhead work and holding yourself on your hands." },
    deepCore: { name: "Deep core", does: "Transverse abdominis and multifidus brace the spine from inside. Challenged by slow, controlled core work like dead bugs and bird dogs." },
    antiRotation: { name: "Anti-rotation", does: "The trunk resisting being twisted. Challenged by one-arm and one-side moves." },
    deepHip: { name: "Deep hip", does: "Glute minimus and the small rotators deep in the hip. Keep the knee and pelvis steady on one leg." },
    footAnkle: { name: "Feet & ankles", does: "Small foot muscles and the ankle stabilizers. Challenged by standing on one leg and landing." },
    grip: { name: "Grip", does: "The many small hand and forearm muscles. Challenged by heavy holds and carries." },
    posture: { name: "Posture", does: "The upper-back and neck extensors that hold you tall under a load." },
  };

  // Exercise tags: "main muscles | secondary muscles | stabilizers"
  const TAGS: Record<string, string> = {
    gobletSquat: "vasti gluteMax | adductors abs erectors | deepCore posture",
    rdl: "hamsHip gluteMax | erectors forearmFlexors midBack | grip posture",
    reverseLunge: "gluteMax vasti | gluteMed adductors hamsHip | deepHip footAnkle grip",
    gluteBridge: "gluteMax | hamsHip abs |",
    suitcaseMarch: "obliques gluteMed | abs forearmFlexors upperTraps hipFlexors | antiRotation grip deepCore footAnkle posture",
    floorPress: "midChest tricepsLateral | frontDelt tricepsLong | rotatorCuff",
    overheadPress: "frontDelt tricepsLateral | sideDelt upperTraps upperChest abs | rotatorCuff scapular deepCore",
    lateralRaise: "sideDelt | upperTraps frontDelt | scapular",
    tricepsExtension: "tricepsLong | tricepsLateral abs | deepCore",
    floorFly: "midChest | upperChest frontDelt bicepsShort | rotatorCuff",
    bentOverRow: "midBack lats | rearDelt bicepsLong brachialis erectors | grip posture",
    oneArmRow: "lats midBack | rearDelt bicepsLong brachialis obliques | antiRotation grip",
    rearDeltFly: "rearDelt midBack | upperTraps | rotatorCuff scapular posture",
    hammerCurl: "brachialis forearmExtensors | bicepsLong forearmFlexors | grip",
    concentrationCurl: "bicepsShort | bicepsLong brachialis forearmFlexors |",
    deadBug: "abs | obliques hipFlexors | deepCore antiRotation",
    birdDog: "gluteMax erectors | abs gluteMed frontDelt | deepCore antiRotation scapular",
    russianTwist: "obliques | abs hipFlexors |",
    singleLegBridge: "gluteMax | hamsHip gluteMed abs | antiRotation deepHip",
    frogPump: "gluteMax | gluteMed adductors |",
    marchingBridge: "gluteMax | hamsHip abs obliques hipFlexors | antiRotation deepCore",
    couchHipThrust: "gluteMax | hamsHip vasti abs |",
    singleLegHipThrust: "gluteMax | hamsHip gluteMed abs | antiRotation deepHip",
    elevatedBridge: "gluteMax hamsKnee | hamsHip abs |",
    sumoDeadlift: "gluteMax adductors | hamsHip vasti erectors forearmFlexors | grip",
    singleLegRdl: "gluteMax hamsHip | gluteMed erectors abs | deepHip footAnkle antiRotation",
    bStanceRdl: "gluteMax hamsHip | erectors forearmFlexors gluteMed | deepHip grip",
    goodMorning: "hamsHip erectors | gluteMax abs | posture deepCore",
    dumbbellDeadlift: "gluteMax hamsHip vasti | erectors forearmFlexors upperTraps midBack | grip posture",
    kneelingSquat: "gluteMax | hamsHip abs |",
    sumoSquat: "gluteMax adductors vasti | abs | posture",
    pulseSquat: "vasti gluteMax | adductors abs |",
    jumpSquat: "gluteMax vasti | gastrocnemius soleus hamsHip rectusFemoris | footAnkle",
    cossackSquat: "adductors gluteMax vasti | hamsHip gluteMed | deepHip footAnkle",
    lateralSquatWalk: "gluteMed gluteMax | vasti adductors | deepHip",
    splitSquat: "gluteMax vasti | adductors hamsHip rectusFemoris | footAnkle grip",
    bulgarianSplitSquat: "gluteMax vasti | adductors hamsHip gluteMed rectusFemoris | deepHip footAnkle grip",
    curtsyLunge: "gluteMax gluteMed | vasti adductors | deepHip footAnkle",
    lateralLunge: "gluteMax adductors | vasti gluteMed | deepHip",
    walkingLunge: "gluteMax vasti | hamsHip adductors gastrocnemius | footAnkle grip deepHip",
    stepUp: "gluteMax vasti | hamsHip gastrocnemius | footAnkle deepHip grip",
    lungeKneeDrive: "gluteMax vasti | hipFlexors rectusFemoris abs gluteMed gastrocnemius | footAnkle deepHip",
    skaterSquat: "gluteMax vasti | gluteMed hamsHip | deepHip footAnkle",
    singleLegBoxSquat: "vasti gluteMax | gluteMed rectusFemoris abs | deepHip footAnkle",
    fireHydrant: "gluteMed | gluteMax abs | deepHip deepCore scapular",
    clamshell: "gluteMed | gluteMax | deepHip",
    sideLyingLegRaise: "gluteMed | obliques | deepHip",
    standingAbduction: "gluteMed | abs obliques | deepHip footAnkle",
    sidePlankClam: "gluteMed obliques | abs frontDelt | deepHip deepCore scapular",
    donkeyKick: "gluteMax | hamsHip abs | deepCore scapular",
    standingKickback: "gluteMax | hamsHip abs | footAnkle deepHip",
    rainbowKick: "gluteMax gluteMed | abs frontDelt | deepCore scapular",
    proneLegLift: "gluteMax | hamsHip erectors |",
    pushUp: "midChest tricepsLateral | frontDelt upperChest abs | scapular deepCore",
    declinePushUp: "upperChest frontDelt | tricepsLateral midChest abs | scapular deepCore",
    pikePushUp: "frontDelt tricepsLateral | upperChest sideDelt upperTraps | scapular rotatorCuff",
    uprightRow: "sideDelt upperTraps | frontDelt brachialis | grip",
    frontRaise: "frontDelt | upperChest sideDelt | scapular",
    pullover: "lats midChest | tricepsLong abs | scapular rotatorCuff",
    renegadeRow: "lats midBack | obliques abs tricepsLateral | antiRotation deepCore scapular grip",
    proneYRaise: "rearDelt midBack | upperTraps erectors | scapular rotatorCuff posture",
    shrug: "upperTraps | forearmFlexors neck | grip posture",
    bicepsCurl: "bicepsShort bicepsLong | brachialis forearmFlexors | grip",
    reverseCurl: "forearmExtensors brachialis | bicepsLong | grip",
    wristCurl: "forearmFlexors | forearmExtensors | grip",
    skullCrusher: "tricepsLong tricepsLateral | midChest |",
    kickback: "tricepsLateral tricepsLong | rearDelt | posture",
    chairDip: "tricepsLateral tricepsLong | midChest frontDelt | scapular",
    plank: "abs | obliques frontDelt gluteMax | deepCore antiRotation scapular",
    legRaise: "abs hipFlexors | rectusFemoris obliques | deepCore",
    kneeTuck: "abs hipFlexors | rectusFemoris obliques | deepCore",
    superman: "erectors gluteMax | midBack hamsHip rearDelt | posture deepCore",
    farmersCarry: "forearmFlexors upperTraps | obliques abs gluteMed | grip posture footAnkle deepCore",
    calfRaise: "gastrocnemius | soleus | footAnkle",
    seatedCalfRaise: "soleus | gastrocnemius | footAnkle",
    tibialisRaise: "tibialis | | footAnkle",
    sliderCurl: "hamsKnee | gluteMax hamsHip gastrocnemius | deepCore antiRotation",
    legCurl: "hamsKnee | gastrocnemius |",
    legExtension: "rectusFemoris vasti | hipFlexors |",
    neckIso: "neck | upperTraps | posture",
    neckCurl: "neck | abs | posture",
    reverseGripPress: "upperChest tricepsLateral | midChest frontDelt | rotatorCuff",
    dragCurl: "bicepsLong brachialis | bicepsShort forearmFlexors | grip",
    sissySquat: "rectusFemoris vasti | abs | footAnkle",
    singleLegCalfRaise: "gastrocnemius | soleus | footAnkle deepHip grip",
    bentKneeCalfRaise: "soleus | gastrocnemius | footAnkle grip",
    dbTibRaise: "tibialis | | footAnkle",
  };
  const words = (s: string) => s.trim().split(/\s+/).filter(Boolean);
  for (const [k, e] of Object.entries(window.EXERCISES)) {
    const t = TAGS[k];
    if (!t) { console.error(`muscles.ts: no muscle tags for "${k}"`); e.primary = []; e.secondary = []; e.stab = []; continue; }
    const [pri, sec, stab] = t.split("|").map(words);
    for (const m of [...pri, ...sec]) if (!window.MUSCLES[m]) console.error(`muscles.ts: unknown muscle "${m}" on "${k}"`);
    for (const s of stab) if (!window.STABILIZERS[s]) console.error(`muscles.ts: unknown stabilizer "${s}" on "${k}"`);
    e.primary = pri; e.secondary = sec; e.stab = stab;
    // menu areas follow from the main muscles
    e.areas = [...new Set(pri.map((m) => window.MUSCLES[m].area))];
  }

  // ---------- coverage ----------
  // A move doesn't train every muscle it touches equally, so coverage counts how much work each target gets:
  // a main muscle counts 1, a secondary ⅓ (WORK.sec), a stabilizer challenge ½. A target is fully covered at 1:
  // one move where it's a main muscle, or about three where it only helps. Coverage % is the average over the
  // targets of min(1, work), so muscles that are only barely touched pull it down instead of counting as done.
  // The Coverage slider asks "how much do I care to cover?"; fillSteps answers with the fewest extra moves (a
  // greedy cover: each step adds the move that adds the most missing work, bigger muscles weighing more).
  const WORK = { pri: 1, sec: 0.35, stab: 0.5 };
  const MUS = window.MUSCLES, STAB = window.STABILIZERS, EX = window.EXERCISES;
  // every target: muscles as-is, stabilizers prefixed "s:"
  const ALL = [...Object.keys(MUS), ...Object.keys(STAB).map((s) => "s:" + s)];
  function targets(areas?: string[]): string[] {
    return ALL.filter((t) => t.startsWith("s:") || !areas || areas.includes(MUS[t].area));
  }
  // what a list of moves reaches: main muscles, any muscle (main or secondary), stabilizers
  function reach(moves: string[]) {
    const pri = new Set<string>(), any = new Set<string>();
    for (const k of moves) {
      const e = EX[k];
      if (!e) continue;
      e.primary.forEach((m) => { pri.add(m); any.add(m); });
      e.secondary.forEach((m) => any.add(m));
      e.stab.forEach((s) => { pri.add("s:" + s); any.add("s:" + s); });
    }
    return { pri, any };
  }
  // work per target from a list of moves (uncapped)
  function work(moves: string[]): Map<string, number> {
    const w = new Map<string, number>();
    const add = (t: string, v: number) => w.set(t, (w.get(t) || 0) + v);
    for (const k of moves) {
      const e = EX[k];
      if (!e) continue;
      e.primary.forEach((m) => add(m, WORK.pri));
      e.secondary.forEach((m) => add(m, WORK.sec));
      e.stab.forEach((s) => add("s:" + s, WORK.stab));
    }
    return w;
  }
  // sets per week per muscle: main = 1 set, secondary = ½, times rounds
  function volume(moves: string[], rounds = 1): Record<string, number> {
    const v: Record<string, number> = {};
    for (const k of moves) {
      const e = EX[k];
      if (!e) continue;
      e.primary.forEach((m) => (v[m] = (v[m] || 0) + rounds));
      e.secondary.forEach((m) => (v[m] = (v[m] || 0) + rounds / 2));
    }
    return v;
  }
  // average of min(1, work) over `tgts`, 0–1
  function coverage(moves: string[], tgts: string[]): number {
    if (!tgts.length) return 1;
    const w = work(moves);
    return tgts.reduce((s, t) => s + Math.min(1, w.get(t) || 0), 0) / tgts.length;
  }
  // each target's state for display: full (≥1), light (some work), none
  function detail(moves: string[], tgts: string[]) {
    const w = work(moves), full: string[] = [], light: string[] = [], none: string[] = [];
    for (const t of tgts) { const v = w.get(t) || 0; (v >= 1 - 1e-9 ? full : v > 0 ? light : none).push(t); }
    return { full, light, none, work: w };
  }
  const weight = (t: string) => (t.startsWith("s:") ? 1 : ({ 1: 3, 2: 2, 3: 1.5 }[MUS[t].tier] || 1));
  // weighted value of the capped work, used to rank moves to add or drop
  const value = (w: Map<string, number>, goal: string[]) => goal.reduce((s, t) => s + weight(t) * Math.min(1, w.get(t) || 0), 0);

  // Steps that raise coverage of `days` (one list of moves per workout) toward 100% of the reachable targets.
  // `pool`: moves allowed. `dayFor`: which workout a move goes into (default: the first). `cost`: soft penalty
  // per move (harder than your level…). Each step reports coverage after it is applied.
  function fillSteps(days: string[][], pool: string[], tgts: string[],
    dayFor: (k: string, days: string[][]) => number = () => 0, cost: (k: string) => number = () => 0): CoverStep[] {
    const reachable = reach(pool).any;
    const goal = tgts.filter((t) => reachable.has(t));
    const cur = days.map((d) => [...d]);
    const used = new Set(cur.flat());
    const steps: CoverStep[] = [];
    const moveWork = new Map(pool.map((k) => [k, work([k])]));
    for (;;) {
      const w = work(cur.flat());
      if (goal.every((t) => (w.get(t) || 0) >= 1 - 1e-9)) break;
      let best: string | null = null, bs = 0.05;
      for (const k of pool) {
        if (used.has(k)) continue;
        let g = 0;
        for (const [t, v] of moveWork.get(k)) {
          const have = Math.min(1, w.get(t) || 0);
          if (have < 1 && goal.includes(t)) g += weight(t) * (Math.min(1, have + v) - have);
        }
        if (g <= 0) continue;
        g -= cost(k) + Math.random() * 0.1;
        if (g > bs) { best = k; bs = g; }
      }
      if (!best) break;
      const day = dayFor(best, cur);
      cur[day].push(best);
      used.add(best);
      steps.push({ day, move: best, pct: coverage(cur.flat(), goal) });
    }
    return steps;
  }
  // The other direction, for the low end of the slider: drop moves one at a time, always the one whose loss
  // costs the least coverage (big muscles weigh most), never below `min` moves a workout. Each step reports
  // coverage after the move is dropped.
  function trimSteps(days: string[][], tgts: string[], min = 3): CoverStep[] {
    const cur = days.map((d) => [...d]), steps: CoverStep[] = [];
    for (;;) {
      const all = value(work(cur.flat()), tgts);
      let best: { day: number; j: number } | null = null, bs = Infinity;
      cur.forEach((d, i) => {
        if (d.length <= min) return;
        d.forEach((_, j) => {
          const rest = cur.map((x, ii) => (ii === i ? x.filter((__, jj) => jj !== j) : x)).flat();
          const loss = all - value(work(rest), tgts) - d.length * 0.01 + Math.random() * 0.001;
          if (loss < bs) { best = { day: i, j }; bs = loss; }
        });
      });
      if (!best) break;
      const [move] = cur[best.day].splice(best.j, 1);
      steps.push({ day: best.day, move, pct: coverage(cur.flat(), tgts) });
    }
    return steps;
  }
  // Shape `days` to a target coverage `pct` (0–1) with the fewest moves: below `start` (the coverage of `days`
  // as they are) drop trims while coverage stays at or above pct; above it add steps until pct is reached.
  function applySteps(days: string[][], steps: CoverStep[], pct: number, start: number, trims: CoverStep[] = []): string[][] {
    const out = days.map((d) => [...d]);
    if (pct < start - 1e-9) {
      for (const t of trims) {
        if (t.pct < pct - 1e-9) break;
        const j = out[t.day].indexOf(t.move);
        if (j >= 0) out[t.day].splice(j, 1);
      }
      return out;
    }
    let c = start;
    for (const st of steps) {
      if (c >= pct - 1e-9) break;
      out[st.day].push(st.move);
      c = st.pct;
    }
    return out;
  }
  const label = (t: string) => (t.startsWith("s:") ? STAB[t.slice(2)].name : MUS[t].name);

  window.MUSCLE_MODEL = { WORK, targets, reach, work, detail, volume, coverage, fillSteps, trimSteps, applySteps, label };
})();
