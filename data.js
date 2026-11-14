// All workout content lives here. Edit freely.
// video: main YouTube id. alts: backups ("Try another video" cycles through them).
// shape: "tall" = vertical short (9:16), "wide" = normal video (16:9).
window.EXERCISES = {
  gobletSquat: {
    name: "Goblet Squat", dumbbells: 1, reps: "10–12 reps", muscles: ["Legs", "Glutes", "Core"],
    cues: ["Hold 1 dumbbell at your chest", "Sit down and back", "Lower slowly, about 3 seconds"],
    video: { id: "lRYBbchqxtI", shape: "tall" }, alts: [{ id: "7-80HiXX1K8", shape: "tall" }, { id: "CkFzgR55gho", shape: "wide" }],
  },
  rdl: {
    name: "Romanian Deadlift", dumbbells: 2, reps: "10–12 reps", muscles: ["Hamstrings", "Glutes"],
    cues: ["Hold both dumbbells in front", "Push hips back", "Soft knees, flat back"],
    video: { id: "vnEANU7BqqY", shape: "tall" }, alts: [{ id: "hu3jRvTc_po", shape: "tall" }, { id: "5WxMW-Fu5KU", shape: "wide" }],
  },
  reverseLunge: {
    name: "Reverse Lunge", dumbbells: 2, reps: "8 reps each leg", muscles: ["Legs", "Glutes"],
    cues: ["Step back gently", "Front foot stays planted", "Use bodyweight first if needed"],
    tip: "If needed: Chair Sit-to-Stand instead",
    video: { id: "J9MpoAQCjos", shape: "tall" }, alts: [{ id: "Q2k3kYbtOcI", shape: "wide" }, { id: "xrPteyQLGAo", shape: "wide" }],
  },
  gluteBridge: {
    name: "Dumbbell Glute Bridge", dumbbells: 1, reps: "12–15 reps", muscles: ["Glutes", "Hamstrings"],
    cues: ["1 dumbbell across your hips", "Push through your feet", "Squeeze glutes at the top"],
    video: { id: "iOrJXNUH3to", shape: "tall" }, alts: [{ id: "PSMW7iSi2BU", shape: "wide" }, { id: "E6VLOEz7tWE", shape: "wide" }],
  },
  suitcaseMarch: {
    name: "Suitcase March", dumbbells: 1, reps: "30 sec each side", timed: { seconds: 30, sides: ["Dumbbell in LEFT hand", "Dumbbell in RIGHT hand"] },
    muscles: ["Core", "Posture", "Grip"],
    cues: ["Hold 1 dumbbell at your side", "March slowly", "Stand tall, shoulders level"],
    video: { id: "TLjp2UAl1JQ", shape: "wide" }, alts: [{ id: "LhX0EnTvPE4", shape: "wide" }, { id: "MJy2__aHv2Y", shape: "tall" }],
  },
  floorPress: {
    name: "Dumbbell Floor Press", dumbbells: 2, reps: "10–12 reps", muscles: ["Chest", "Triceps"],
    cues: ["1 dumbbell in each hand", "Press straight up", "Elbows about 45°"],
    video: { id: "UBmpZ7l5Nlk", shape: "tall" }, alts: [{ id: "T0Y3OBF1bNI", shape: "wide" }, { id: "_KwWsz38j6M", shape: "wide" }],
  },
  overheadPress: {
    name: "Dumbbell Overhead Press", dumbbells: 2, reps: "8–10 reps", muscles: ["Shoulders", "Triceps", "Core"],
    cues: ["Start at shoulders", "Press overhead", "Keep ribs down"],
    tip: "Too hard? Do 1 dumbbell at a time",
    video: { id: "wO0l5jW2NtQ", shape: "tall" }, alts: [{ id: "UcakkCPy-rk", shape: "tall" }, { id: "ldABahTUB0U", shape: "tall" }],
  },
  lateralRaise: {
    name: "Lateral Raise", dumbbells: 2, reps: "10–12 reps", muscles: ["Side Shoulders"],
    cues: ["Soft elbows", "Raise to shoulder height", "Lower slowly"],
    video: { id: "xyK8UiC-BUw", shape: "tall" }, alts: [{ id: "Kl3LEzQ5Zqs", shape: "tall" }, { id: "XPPfnSEATJA", shape: "wide" }],
  },
  tricepsExtension: {
    name: "Overhead Triceps Extension", dumbbells: 1, reps: "10–12 reps", muscles: ["Triceps"],
    cues: ["Hold 1 dumbbell with both hands", "Elbows point up", "Straighten arms smoothly"],
    video: { id: "AYqg9S5FrUU", shape: "tall" }, alts: [{ id: "IJ6J7EKprsc", shape: "wide" }, { id: "-Vyt2QdsR7E", shape: "wide" }],
  },
  floorFly: {
    name: "Floor Chest Fly", dumbbells: 2, reps: "8–10 reps", muscles: ["Chest", "Front Shoulders"],
    cues: ["Slight bend in elbows", "Open until arms touch the floor", "Bring arms together slowly"],
    tip: "Smaller range is okay",
    video: { id: "WwWg5VksY18", shape: "tall" }, alts: [{ id: "bgC53-J-6gA", shape: "wide" }, { id: "fUWA_KAXKyQ", shape: "tall" }],
  },
  bentOverRow: {
    name: "Bent-Over Row", dumbbells: 2, reps: "10–12 reps", muscles: ["Upper Back", "Lats", "Biceps"],
    cues: ["Flat back, hinge at hips", "Drive elbows toward hips"],
    video: { id: "6gvmcqr226U", shape: "wide" }, alts: [{ id: "HUp6djHa37Y", shape: "wide" }, { id: "iCM5U0_b9Mg", shape: "wide" }],
  },
  oneArmRow: {
    name: "One-Arm Row (no bench)", dumbbells: 1, reps: "10 reps each side", muscles: ["Mid-Back", "Lats", "Biceps"],
    cues: ["Free hand on your knee or a chair", "Pull elbow back", "Keep torso still"],
    video: { id: "ISllYtUfAx4", shape: "tall" }, alts: [{ id: "tDgQx0W1JP0", shape: "wide" }, { id: "Pw3glZCQMGM", shape: "tall" }],
  },
  rearDeltFly: {
    name: "Rear Delt Fly", dumbbells: 2, reps: "12–15 reps", muscles: ["Upper Back", "Rear Shoulders"],
    cues: ["Soft bend in elbows", "Lift arms wide", "Squeeze shoulder blades"],
    video: { id: "Fnz4v8WA5kM", shape: "wide" }, alts: [{ id: "lFJBHzGIKIE", shape: "wide" }, { id: "X-iWEQx9X-o", shape: "wide" }],
  },
  hammerCurl: {
    name: "Hammer Curl", dumbbells: 2, reps: "10–12 reps", muscles: ["Biceps", "Forearms"],
    cues: ["Palms face in", "Keep elbows close to body"],
    video: { id: "VqoFbCmRyyk", shape: "tall" }, alts: [{ id: "OPqe0kCxmR8", shape: "wide" }, { id: "VXj0Zx4v5go", shape: "wide" }],
  },
  concentrationCurl: {
    name: "Concentration Curl", dumbbells: 1, reps: "10 reps each side", muscles: ["Biceps"],
    cues: ["Sit on a chair or couch edge", "Brace elbow on inner thigh", "Curl with control"],
    video: { id: "cHxRJdSVIkA", shape: "tall" }, alts: [{ id: "VMbDQ8PZazY", shape: "wide" }, { id: "nMIGb5-ytRE", shape: "wide" }],
  },
  deadBug: {
    name: "Dead Bug", dumbbells: 0, reps: "8 reps each side", muscles: ["Deep Core", "Coordination"],
    cues: ["Low back gently pressed down", "Lower opposite arm and leg", "Move slowly"],
    tip: "Bodyweight is fine",
    video: { id: "DqLL45uk2Tk", shape: "tall" }, alts: [{ id: "o4GKiEoYClI", shape: "wide" }, { id: "GbSC02oU3To", shape: "wide" }],
  },
  birdDog: {
    name: "Bird Dog", dumbbells: 0, reps: "8 reps each side", muscles: ["Glutes", "Mid-Back", "Core"],
    cues: ["Hands under shoulders", "Reach long through arm and leg", "Keep hips level"],
    tip: "Move slowly and stay steady",
    video: { id: "_1j_HWknGLg", shape: "tall" }, alts: [{ id: "QVRtIHp9h-M", shape: "wide" }, { id: "xEDnlOxeJH4", shape: "wide" }],
  },
  russianTwist: {
    name: "Russian Twist", dumbbells: 1, reps: "16–20 twists", muscles: ["Obliques", "Core"],
    cues: ["Lean back slightly", "Rotate torso, not just arms", "No swinging"],
    tip: "Go bodyweight if needed",
    video: { id: "MKfv0WiTeEQ", shape: "tall" }, alts: [{ id: "pzMWYoeSCzw", shape: "wide" }, { id: "FShbaqrGGu4", shape: "wide" }],
  },
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
