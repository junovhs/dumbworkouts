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
    video: { id: "TLjp2UAl1JQ", shape: "wide" }, alts: [{ id: "LhX0EnTvPE4", shape: "wide" }, { id: "MJy2__aHv2Y", shape: "tall" }],
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
    video: { id: "xyK8UiC-BUw", shape: "tall" }, alts: [{ id: "Kl3LEzQ5Zqs", shape: "tall" }, { id: "XPPfnSEATJA", shape: "wide" }],
  },
  tricepsExtension: {
    name: "Overhead Triceps Extension", dumbbells: 1, reps: "10–12 reps", primary: ["triceps"], secondary: ["abs"],
    cues: ["Hold 1 dumbbell with both hands", "Elbows point up", "Straighten arms smoothly"],
    video: { id: "AYqg9S5FrUU", shape: "tall" }, alts: [{ id: "IJ6J7EKprsc", shape: "wide" }, { id: "-Vyt2QdsR7E", shape: "wide" }],
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
    video: { id: "_1j_HWknGLg", shape: "tall" }, alts: [{ id: "QVRtIHp9h-M", shape: "wide" }, { id: "xEDnlOxeJH4", shape: "wide" }],
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
