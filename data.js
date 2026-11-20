// All workout content lives here. Edit freely.
// video: main YouTube id. alts: backups ("Try another video" cycles through them).
// shape: "tall" = vertical short (9:16), "wide" = normal video (16:9).
window.EXERCISES = {
  gobletSquat: {
    name: "Goblet Squat", dumbbells: 1, reps: "10–12 reps", primary: ["quads", "glutes"], secondary: ["adductors", "abs"],
    cues: ["Hold 1 dumbbell at your chest", "Sit down and back", "Lower slowly, about 3 seconds"],
    video: { id: "lRYBbchqxtI", shape: "tall" }, alts: [{ id: "7-80HiXX1K8", shape: "tall" }, { id: "CkFzgR55gho", shape: "wide" }],
  },
  rdl: {
    name: "Romanian Deadlift", dumbbells: 2, reps: "10–12 reps", primary: ["hamstrings", "glutes"], secondary: ["lowerBack", "forearms"],
    cues: ["Hold both dumbbells in front", "Push hips back", "Soft knees, flat back"],
    video: { id: "vnEANU7BqqY", shape: "tall" }, alts: [{ id: "hu3jRvTc_po", shape: "tall" }, { id: "5WxMW-Fu5KU", shape: "wide" }],
  },
  reverseLunge: {
    name: "Reverse Lunge", dumbbells: 2, reps: "8 reps each leg", primary: ["glutes", "quads"], secondary: ["sideGlutes", "hamstrings", "adductors"],
    cues: ["Step back gently", "Front foot stays planted", "Use bodyweight first if needed"],
    tip: "If needed: Chair Sit-to-Stand instead",
    video: { id: "J9MpoAQCjos", shape: "tall" }, alts: [{ id: "Q2k3kYbtOcI", shape: "wide" }, { id: "xrPteyQLGAo", shape: "wide" }],
  },
  gluteBridge: {
    name: "Dumbbell Glute Bridge", dumbbells: 1, reps: "12–15 reps", primary: ["glutes"], secondary: ["hamstrings", "abs"],
    cues: ["1 dumbbell across your hips", "Push through your feet", "Squeeze glutes at the top"],
    video: { id: "iOrJXNUH3to", shape: "tall" }, alts: [{ id: "PSMW7iSi2BU", shape: "wide" }, { id: "E6VLOEz7tWE", shape: "wide" }],
  },
  suitcaseMarch: {
    name: "Suitcase March", dumbbells: 1, reps: "30 sec each side", timed: { seconds: 30, sides: ["Dumbbell in LEFT hand", "Dumbbell in RIGHT hand"] },
    primary: ["obliques", "sideGlutes"], secondary: ["abs", "forearms", "traps"],
    cues: ["Hold 1 dumbbell at your side", "March slowly", "Stand tall, shoulders level"],
    video: { id: "TLjp2UAl1JQ", shape: "wide" }, alts: [{ id: "LhX0EnTvPE4", shape: "wide" }, { id: "MJy2__aHv2Y", shape: "tall" }, { id: "DeMrcRuwsQg", shape: "tall" }, { id: "PaxSuVXsQls", shape: "wide" }],
  },
  floorPress: {
    name: "Dumbbell Floor Press", dumbbells: 2, reps: "10–12 reps", primary: ["chest", "triceps"], secondary: ["shoulders"],
    cues: ["1 dumbbell in each hand", "Press straight up", "Elbows about 45°"],
    video: { id: "UBmpZ7l5Nlk", shape: "tall" }, alts: [{ id: "T0Y3OBF1bNI", shape: "wide" }, { id: "_KwWsz38j6M", shape: "wide" }],
  },
  overheadPress: {
    name: "Dumbbell Overhead Press", dumbbells: 2, reps: "8–10 reps", primary: ["shoulders", "triceps"], secondary: ["traps", "abs"],
    cues: ["Start at shoulders", "Press overhead", "Keep ribs down"],
    tip: "Too hard? Do 1 dumbbell at a time",
    video: { id: "wO0l5jW2NtQ", shape: "tall" }, alts: [{ id: "UcakkCPy-rk", shape: "tall" }, { id: "ldABahTUB0U", shape: "tall" }],
  },
  lateralRaise: {
    name: "Lateral Raise", dumbbells: 2, reps: "10–12 reps", primary: ["shoulders"], secondary: ["traps"],
    cues: ["Soft elbows", "Raise to shoulder height", "Lower slowly"],
    video: { id: "xyK8UiC-BUw", shape: "tall" }, alts: [{ id: "Kl3LEzQ5Zqs", shape: "tall" }, { id: "XPPfnSEATJA", shape: "wide" }, { id: "eaM8JxEn6Ig", shape: "tall" }, { id: "SHvXdGxTLm0", shape: "tall" }],
  },
  tricepsExtension: {
    name: "Overhead Triceps Extension", dumbbells: 1, reps: "10–12 reps", primary: ["triceps"], secondary: ["abs"],
    cues: ["Hold 1 dumbbell with both hands", "Elbows point up", "Straighten arms smoothly"],
    video: { id: "AYqg9S5FrUU", shape: "tall" }, alts: [{ id: "IJ6J7EKprsc", shape: "wide" }, { id: "-Vyt2QdsR7E", shape: "wide" }, { id: "QKfRhY8qvhg", shape: "tall" }],
  },
  floorFly: {
    name: "Floor Chest Fly", dumbbells: 2, reps: "8–10 reps", primary: ["chest"], secondary: ["shoulders", "biceps"],
    cues: ["Slight bend in elbows", "Open until arms touch the floor", "Bring arms together slowly"],
    tip: "Smaller range is okay",
    video: { id: "WwWg5VksY18", shape: "tall" }, alts: [{ id: "bgC53-J-6gA", shape: "wide" }, { id: "fUWA_KAXKyQ", shape: "tall" }],
  },
  bentOverRow: {
    name: "Bent-Over Row", dumbbells: 2, reps: "10–12 reps", primary: ["upperBack", "lats"], secondary: ["biceps", "rearDelts", "lowerBack"],
    cues: ["Flat back, hinge at hips", "Drive elbows toward hips"],
    video: { id: "K0lda9eQfNo", shape: "tall" }, alts: [{ id: "vN8xskk-7G8", shape: "tall" }, { id: "6gvmcqr226U", shape: "wide" }, { id: "IOOLhrkN_NI", shape: "tall" }],
  },
  oneArmRow: {
    name: "One-Arm Row (no bench)", dumbbells: 1, reps: "10 reps each side", primary: ["lats", "upperBack"], secondary: ["biceps", "rearDelts", "obliques"],
    cues: ["Free hand on your knee or a chair", "Pull elbow back", "Keep torso still"],
    video: { id: "Sxqw-AoClcI", shape: "tall" }, alts: [{ id: "IbWwSHwGEJ8", shape: "tall" }, { id: "L_aTduY-mSg", shape: "tall" }, { id: "tDgQx0W1JP0", shape: "wide" }],
  },
  rearDeltFly: {
    name: "Rear Delt Fly", dumbbells: 2, reps: "12–15 reps", primary: ["rearDelts", "upperBack"], secondary: ["traps"],
    cues: ["Soft bend in elbows", "Lift arms wide", "Squeeze shoulder blades"],
    video: { id: "M3udJ4o7ndU", shape: "tall" }, alts: [{ id: "apcNuGp97sY", shape: "tall" }, { id: "__xmBVfQMLc", shape: "tall" }, { id: "62IAwMoHawI", shape: "tall" }],
  },
  hammerCurl: {
    name: "Hammer Curl", dumbbells: 2, reps: "10–12 reps", primary: ["biceps", "forearms"], secondary: [],
    cues: ["Palms face in", "Keep elbows close to body"],
    video: { id: "0qzSDAfBzSw", shape: "tall" }, alts: [{ id: "VqoFbCmRyyk", shape: "tall" }, { id: "EXzrRuekzLU", shape: "tall" }, { id: "vm0zV_WQerE", shape: "tall" }],
  },
  concentrationCurl: {
    name: "Concentration Curl", dumbbells: 1, reps: "10 reps each side", primary: ["biceps"], secondary: ["forearms"],
    cues: ["Sit on a chair or couch edge", "Brace elbow on inner thigh", "Curl with control"],
    video: { id: "5Jv-CYmT25E", shape: "tall" }, alts: [{ id: "0CWxnhSyPtU", shape: "tall" }, { id: "VMbDQ8PZazY", shape: "wide" }, { id: "TYrurDZTj9I", shape: "tall" }],
  },
  deadBug: {
    name: "Dead Bug", dumbbells: 0, reps: "8 reps each side", primary: ["abs"], secondary: ["obliques"],
    cues: ["Low back gently pressed down", "Lower opposite arm and leg", "Move slowly"],
    tip: "Bodyweight is fine",
    video: { id: "DqLL45uk2Tk", shape: "tall" }, alts: [{ id: "o4GKiEoYClI", shape: "wide" }, { id: "GbSC02oU3To", shape: "wide" }],
  },
  birdDog: {
    name: "Bird Dog", dumbbells: 0, reps: "8 reps each side", primary: ["glutes", "lowerBack"], secondary: ["abs", "sideGlutes", "shoulders"],
    cues: ["Hands under shoulders", "Reach long through arm and leg", "Keep hips level"],
    tip: "Move slowly and stay steady",
    video: { id: "_1j_HWknGLg", shape: "tall" }, alts: [{ id: "QVRtIHp9h-M", shape: "wide" }, { id: "xEDnlOxeJH4", shape: "wide" }, { id: "X0FpQEjEA40", shape: "tall" }, { id: "knsOPG88idk", shape: "tall" }],
  },
  russianTwist: {
    name: "Russian Twist", dumbbells: 1, reps: "16–20 twists", primary: ["obliques"], secondary: ["abs"],
    cues: ["Lean back slightly", "Rotate torso, not just arms", "No swinging"],
    tip: "Go bodyweight if needed",
    video: { id: "MKfv0WiTeEQ", shape: "tall" }, alts: [{ id: "pzMWYoeSCzw", shape: "wide" }, { id: "FShbaqrGGu4", shape: "wide" }],
  },
};

// Muscles: plain-language info + which body-map regions light up (see bodymap.js).
window.MUSCLES = {
  glutes:     { name: "Glutes", sci: "Gluteus maximus", regions: ["gluteal"], does: "Your biggest muscle. Drives the hips forward to stand up, climb stairs and push off." },
  sideGlutes: { name: "Side glutes", sci: "Gluteus medius & minimus", regions: ["abductors"], does: "Keep your pelvis level on one leg and move the leg out to the side. Help knees track straight." },
  hamstrings: { name: "Hamstrings", sci: "Back of the thigh", regions: ["hamstring"], does: "Bend the knee and help the glutes straighten the hip, as in hinging and sprinting." },
  quads:      { name: "Quads", sci: "Quadriceps, front of thigh", regions: ["quadriceps"], does: "Straighten the knee. Do most of the work getting up out of a squat or chair." },
  adductors:  { name: "Inner thighs", sci: "Adductors", regions: ["adductor"], does: "Pull the legs together and steady the hips in squats and lunges." },
  calves:     { name: "Calves", sci: "Gastrocnemius & soleus", regions: ["calves", "left-soleus", "right-soleus"], does: "Point the foot and keep you balanced on your feet." },
  abs:        { name: "Abs", sci: "Rectus abdominis & deep core", regions: ["abs"], does: "Brace the trunk and keep the ribs and pelvis stacked so the back stays safe." },
  obliques:   { name: "Obliques", sci: "Side abs", regions: ["obliques"], does: "Twist the torso and stop it bending sideways under a load." },
  lowerBack:  { name: "Lower back", sci: "Spinal erectors", regions: ["lower-back"], does: "Hold the spine straight when you lean forward or lift." },
  upperBack:  { name: "Upper back", sci: "Rhomboids & mid traps", regions: ["upper-back"], does: "Squeeze the shoulder blades together for good posture." },
  lats:       { name: "Lats", sci: "Latissimus dorsi", regions: ["upper-back"], does: "Pull the arms down and back, as in rowing or pulling yourself up." },
  traps:      { name: "Traps", sci: "Upper trapezius", regions: ["trapezius"], does: "Lift and steady the shoulders and support the neck." },
  rearDelts:  { name: "Rear shoulders", sci: "Posterior deltoids", regions: ["back-deltoids"], does: "Pull the arms back and out. Balance pushing work and help posture." },
  shoulders:  { name: "Shoulders", sci: "Front & side deltoids", regions: ["front-deltoids"], does: "Raise the arms forward, out to the side and overhead." },
  chest:      { name: "Chest", sci: "Pectorals", regions: ["chest"], does: "Push the arms forward and bring them together across the body." },
  biceps:     { name: "Biceps", sci: "Front of upper arm", regions: ["biceps"], does: "Bend the elbow and help with pulling." },
  triceps:    { name: "Triceps", sci: "Back of upper arm", regions: ["triceps"], does: "Straighten the elbow. Do much of the work in presses." },
  forearms:   { name: "Forearms & grip", sci: "Wrist and finger muscles", regions: ["forearm"], does: "Hold onto the dumbbells and keep the wrists firm." },
};

window.DAYS = [
  { n: 1, title: "Lower Body + Glutes", focus: "Legs, glutes, and a little core support", color: "#e8336b",
    moves: ["gobletSquat", "rdl", "reverseLunge", "gluteBridge", "suitcaseMarch"] },
  { n: 2, title: "Chest + Shoulders + Triceps", focus: "Chest, shoulders, and triceps", color: "#f08a24",
    moves: ["floorPress", "overheadPress", "lateralRaise", "tricepsExtension", "floorFly"] },
  { n: 3, title: "Back + Biceps", focus: "Strong back, better posture, stronger arms", color: "#8a5cf6",
    moves: ["bentOverRow", "oneArmRow", "rearDeltFly", "hammerCurl", "concentrationCurl"] },
  { n: 4, title: "Core + Glutes + Posture", focus: "Core strength, glute activation, posture", color: "#14a39a",
    moves: ["gluteBridge", "deadBug", "suitcaseMarch", "birdDog", "russianTwist"] },
];

window.RULES = [
  "Good burn is the goal — not exhaustion",
  "Stop each set with 2–3 reps left",
  "If form breaks, stop the set",
  "Keep at least 1 rest day between strength workouts",
  "Sharp pain or dizziness = stop",
];

// Who demonstrates each video (for the Videos: Women / Men setting). Unlisted ids (animations,
// unclear clips) count as a match for either choice.
window.PRESENTER = {};
[
  "-Vyt2QdsR7E", "0CWxnhSyPtU", "36vnWAkL7ZQ", "3vGZyXRZ298", "6gvmcqr226U", "6r0N8oaU4ko", "8fZxWTiIJWo",
  "9AXSxa-iB0w", "ADXZdHAiFJg", "AYqg9S5FrUU", "D9Z8GpyNGi0", "DA4FVJH2PnU", "DqLL45uk2Tk", "E6VLOEz7tWE",
  "EK8OS6DZEwQ", "GFosoEmNAQA", "GhtIRFqClwE", "IJ6J7EKprsc", "IOOLhrkN_NI", "J9MpoAQCjos", "K0oHBV6w3T8",
  "Kl3LEzQ5Zqs", "MJvazUpmdZU", "MKfv0WiTeEQ", "NqL21LLv5ak", "NxJz1BTiSnQ", "O7IT2BbYC6k", "OJ2wlRMVn5g",
  "PzDbmqL6qo8", "R_fJ6H3FlVw", "TYrurDZTj9I", "Tc1TsAdoDRo", "UBmpZ7l5Nlk", "VMbDQ8PZazY", "VqoFbCmRyyk",
  "WwWg5VksY18", "XPPfnSEATJA", "XQyUlYxTGuM", "YBxfr3La96E", "__xmBVfQMLc", "_m0z8EgqlVY", "_r7FCi7e-Fw",
  "a1xnrwNkMkA", "a9lx_T0f7yc", "abYz-R6YNXU", "apcNuGp97sY", "bnCGbY7hu5I", "cUJc9ZaSqbU", "hlth_Of9LEc",
  "hu3jRvTc_po", "iDbSKR6_jJQ", "lRYBbchqxtI", "ldABahTUB0U", "o4GKiEoYClI", "qB_bC7-CQjI", "qW2ps30p9m4",
  "r320kgGBBWs", "tDgQx0W1JP0", "vm0zV_WQerE", "wO0l5jW2NtQ", "wklI-e2WpFQ", "xg0qzjFcono", "xyK8UiC-BUw",
  "zteT9sVYOSM",
  "DeMrcRuwsQg", "PaxSuVXsQls", "X0FpQEjEA40", "knsOPG88idk", "-sTDH8Chc1E", "msfdrPWJ-9o", "DvPSiJ6FPxU", "i3FT7g-UpNg", "De9OUZz5W_I", "O3pmXUqgsU4", "H02OuhfYtoM", "ElCIiU1FWxg", "rngJ3yYCX6g", "oVSlEf9qj1A", "tfx_W3WJKks", "aJUtDmOtZC4", "JsDRMr1T7Is", "iqP1OF0atKM"
].forEach((id) => (window.PRESENTER[id] = "m"));
[
  "-IlIs1LhVDY", "-mJAo1_zE7k", "-rQv_Lbn3Gk", "0qzSDAfBzSw", "0z0NEUtwxF0", "13d3DCI_-BI", "1EqGnNuUalk",
  "2ea3_b9rFdM", "4LYL84PV3AY", "5Jv-CYmT25E", "5WxMW-Fu5KU", "5b4TonBLVgM", "62IAwMoHawI", "6B5pXXAd9OU",
  "7-80HiXX1K8", "73udYXFW7dg", "8ANwlFziwtk", "91EUeiZsSNc", "9prcXIdXev0", "CP8FnbRod6Q", "CX0OPjpkUBE",
  "CkFzgR55gho", "CwlagttgD5Y", "DYw8QTutJ60", "E36nkfxG15U", "EXzrRuekzLU", "EYr4pewiBQo", "F1utkqNL9hA",
  "FShbaqrGGu4", "Fck2BoZ_dXo", "GbSC02oU3To", "I1eq_u2snYI", "IACvsUqSqcA", "IRkRgk2Gc1E", "ITyJfMetA8s",
  "IbWwSHwGEJ8", "IrJBHdyZXFo", "K0lda9eQfNo", "KDmxshCrqA4", "KoXAfvFB-YY", "KsYwYl13IDc", "Kthqc3yyyK4",
  "L3Nlm_x3c6Q", "L_aTduY-mSg", "LhX0EnTvPE4", "LryFP0rlPG0", "M3udJ4o7ndU", "MJy2__aHv2Y", "MkyIs2uLjDo",
  "NCzebKJUN8c", "O8k_pNbSOVM", "ORO64L7Iz4w", "OxWZ-G-RdCM", "PSMW7iSi2BU", "Q2k3kYbtOcI", "QVRtIHp9h-M",
  "QuAQZ5faoAE", "SJ1Xuz9D-ZQ", "SQWgbL0YGas", "Sxqw-AoClcI", "T0Y3OBF1bNI", "TLjp2UAl1JQ", "UBTnZaJS398",
  "UcakkCPy-rk", "V1NKta2znwU", "VA9z64mNSCw", "Wcmg-3iHwjQ", "XIfYC7xsInU", "XcPDvQlwPKg", "XkiiUjR_zJ4",
  "Y0G0DqWsSuM", "Y3Mj5CsLcOQ", "Y40n8JJ_Fu0", "YJdQCJGsOGk", "YxwXmbxly6s", "ZOWNWH8szDI", "ZmoRvRrgBj0",
  "_1j_HWknGLg", "_KwWsz38j6M", "aVikygf5YKA", "bgC53-J-6gA", "d3zns5GlncI", "du-5zccAfdM", "f-RQq1fCX34",
  "fUWA_KAXKyQ", "gFyIjunfbbg", "guAKp7vHzqQ", "gvtJGZvZO8E", "h5TmdMMtIT4", "iOrJXNUH3to", "kHgMJOpDGRQ",
  "kK4O5YZYSG8", "mKL3k6buTe0", "nll7MQwLNwo", "nxylkhcpRGM", "okn5Jo0BdOk", "plb5jEO4Unw", "pzMWYoeSCzw",
  "qBqKuEQl9sI", "sevOYS5vp7U", "t0dnWvIfAZ0", "tSz-vQYacZs", "vGuyEm2KWSI", "vN8xskk-7G8", "va6aW8jnNEM",
  "vnEANU7BqqY", "wbsT9xBVewM", "xEDnlOxeJH4", "xrPteyQLGAo", "yFxqt9Oku9A", "yaamXQLtB9M", "zNGamFp460o",
  "eaM8JxEn6Ig", "SHvXdGxTLm0", "QKfRhY8qvhg"
].forEach((id) => (window.PRESENTER[id] = "f"));
