// Muscle model. Loaded after library.js, before plan.js.
// Two layers, counted differently:
//  - 30 prime movers in 12 groups: the muscles that grow from sets and reps. A main muscle counts as 1 set, a secondary as ½.
//  - 8 stabilizer groups: small muscles that hold joints steady. Counted as covered or not, never as volume.
// Each prime mover has a size tier, which the Coverage control uses:
//   1 = big movers, 2 = the other major muscles, 3 = the smaller ones. Stabilizers sit at level 4.
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
    ["forearmFlexors", "Grip", "Forearm flexors", "forearms", 3, "arms", ["forearm"], "Close the hand and curl the wrist. Hold onto the dumbbells."],
    ["forearmExtensors", "Forearm tops", "Forearm extensors", "forearms", 3, "arms", ["forearm"], "Open the hand and lift the wrist. Balance grip work and protect the elbows."],
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
    goodMorning: "hamsHip gluteMax | erectors abs | posture deepCore",
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
  // Levels for the Coverage control. Each level's targets include everything below it.
  const LEVELS: CoverageLevel[] = [
    { n: 1, name: "Big movers", blurb: "Glutes, quads, hamstrings, chest, lats, mid back" },
    { n: 2, name: "Major muscles", blurb: "Adds shoulders, abs, obliques, side glutes, inner thighs, triceps…" },
    { n: 3, name: "Every muscle", blurb: "Adds biceps heads, forearms, rear shoulders, calves, hip flexors…" },
    { n: 4, name: "+ Stabilizers", blurb: "Adds rotator cuff, deep core, deep hip, feet & ankles, grip…" },
  ];
  const MUS = window.MUSCLES, STAB = window.STABILIZERS, EX = window.EXERCISES;
  // targets are ids: muscles as-is, stabilizers prefixed "s:"
  function targets(level: number, areas?: string[]): string[] {
    const mus = Object.keys(MUS).filter((m) => MUS[m].tier <= level && (!areas || areas.includes(MUS[m].area)));
    return level >= 4 ? [...mus, ...Object.keys(STAB).map((s) => "s:" + s)] : mus;
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
  // share of `tgts` that `moves` reach, 0–1
  function coverage(moves: string[], tgts: string[]): number {
    if (!tgts.length) return 1;
    const { any } = reach(moves);
    return tgts.filter((t) => any.has(t)).length / tgts.length;
  }
  const label = (t: string) => (t.startsWith("s:") ? STAB[t.slice(2)].name : MUS[t].name);

  window.MUSCLE_MODEL = { LEVELS, targets, reach, volume, coverage, label };
})();
