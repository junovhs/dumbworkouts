// Exercise library beyond the 4 program days. Loaded after data.js.
// pattern: movement family the à la carte builder balances across.
//   bridge (hip bridges/thrusts) · hinge (deadlift family) · squat · lunge (single-leg) · side (side glutes) · kickback (glute isolation)
// areas: menu categories an exercise can be picked for.
// Every move uses 2 or fewer dumbbells and no bench (a couch, chair or stair is fine).
(() => {
  const V = (id: string, shape: VideoShape = "tall"): ExerciseVideo => ({ id, shape });
  const NEW: Record<string, Exercise> = {
    // ---------- bridges & thrusts ----------
    singleLegBridge: {
      name: "Single-Leg Glute Bridge", dumbbells: 0, reps: "10 reps each leg", pattern: "bridge",
      video: V("V1NKta2znwU"), alts: [V("91EUeiZsSNc"), V("qB_bC7-CQjI"), V("CP8FnbRod6Q")],
      cues: ["One foot planted, other leg up", "Drive through the planted heel", "Keep hips level at the top"],
    },
    frogPump: {
      name: "Frog Pump", dumbbells: 0, reps: "20 reps", pattern: "bridge",
      video: V("wklI-e2WpFQ", "wide"), alts: [V("yFxqt9Oku9A"), V("5b4TonBLVgM"), V("t0dnWvIfAZ0")],
      cues: ["Soles of the feet together, knees out", "Squeeze up fast", "Short, quick reps"],
      tip: "Hold a dumbbell on your hips to make it harder",
    },
    marchingBridge: {
      name: "Marching Glute Bridge", dumbbells: 0, reps: "10 marches each side", pattern: "bridge",
      video: V("KsYwYl13IDc", "wide"), alts: [V("ZOWNWH8szDI", "wide"), V("ORO64L7Iz4w"), V("YxwXmbxly6s"), V("-sTDH8Chc1E"), V("msfdrPWJ-9o", "wide")],
      cues: ["Bridge up and hold", "Lift one knee, then the other", "Don't let the hips drop or twist"],
    },
    couchHipThrust: {
      name: "Couch Hip Thrust", dumbbells: 1, reps: "12–15 reps", pattern: "bridge",
      video: V("CwlagttgD5Y"), alts: [V("aVikygf5YKA"), V("XkiiUjR_zJ4"), V("DvPSiJ6FPxU"), V("i3FT7g-UpNg", "wide")],
      cues: ["Upper back against the couch edge", "1 dumbbell on your hips", "Chin tucked, ribs down, squeeze at the top"],
    },
    singleLegHipThrust: {
      name: "Single-Leg Hip Thrust", dumbbells: 0, reps: "8–10 reps each leg", pattern: "bridge",
      video: V("bnCGbY7hu5I"), alts: [V("D9Z8GpyNGi0"), V("sevOYS5vp7U", "wide")],
      cues: ["Upper back on the couch edge", "Drive through one heel", "Hips stay square"],
    },
    elevatedBridge: {
      name: "Feet-Elevated Glute Bridge", dumbbells: 1, reps: "12 reps", pattern: "bridge",
      video: V("EYr4pewiBQo"), alts: [V("Y3Mj5CsLcOQ"), V("6gl4x_OqDQ0"), V("hlth_Of9LEc", "wide")],
      cues: ["Heels up on the couch or a step", "Dumbbell on your hips", "Push up through the heels"],
    },

    // ---------- hinges ----------
    sumoDeadlift: {
      name: "Dumbbell Sumo Deadlift", dumbbells: 1, reps: "10–12 reps", pattern: "hinge",
      video: V("tSz-vQYacZs"), alts: [V("f-RQq1fCX34"), V("SQWgbL0YGas", "wide"), V("De9OUZz5W_I", "wide"), V("O3pmXUqgsU4", "wide")],
      cues: ["Wide stance, toes out", "1 dumbbell hanging between your legs", "Flat back, stand tall and squeeze"],
    },
    singleLegRdl: {
      name: "Single-Leg RDL", dumbbells: 1, reps: "8 reps each leg", pattern: "hinge",
      video: V("vGuyEm2KWSI"), alts: [V("OJ2wlRMVn5g"), V("zteT9sVYOSM"), V("R_fJ6H3FlVw")],
      cues: ["Dumbbell in the hand opposite the standing leg", "Hinge forward, back leg reaches long", "Hips stay square to the floor"],
      tip: "Lightly touch a wall for balance if needed",
    },
    bStanceRdl: {
      name: "Kickstand RDL", dumbbells: 2, reps: "10 reps each side", pattern: "hinge",
      video: V("du-5zccAfdM"), alts: [V("zNGamFp460o"), V("NqL21LLv5ak", "wide"), V("KoXAfvFB-YY", "wide")],
      cues: ["Back foot on its toes for balance only", "Most weight on the front leg", "Push hips back, flat back"],
    },
    goodMorning: {
      name: "Dumbbell Good Morning", dumbbells: 1, reps: "10–12 reps", pattern: "hinge",
      video: V("9prcXIdXev0"), alts: [V("4LYL84PV3AY"), V("MkyIs2uLjDo"), V("H02OuhfYtoM")],
      cues: ["Hold 1 dumbbell at your chest", "Soft knees, push hips back", "Stand up by squeezing glutes"],
    },
    dumbbellDeadlift: {
      name: "Dumbbell Deadlift", dumbbells: 2, reps: "10–12 reps", pattern: "hinge",
      video: V("5WxMW-Fu5KU", "wide"), alts: [V("plb5jEO4Unw", "wide"), V("XcPDvQlwPKg"), V("ElCIiU1FWxg")],
      cues: ["Dumbbells beside your feet", "Chest up, flat back", "Push the floor away and stand tall"],
    },
    kneelingSquat: {
      name: "Kneeling Squat", dumbbells: 1, reps: "12–15 reps", pattern: "hinge",
      video: V("0z0NEUtwxF0", "wide"), alts: [V("O7IT2BbYC6k")],
      cues: ["Kneel on a soft surface, dumbbell at chest", "Sit hips back to your heels", "Drive hips forward to tall kneeling"],
    },

    // ---------- squats ----------
    sumoSquat: {
      name: "Dumbbell Sumo Squat", dumbbells: 1, reps: "12–15 reps", pattern: "squat",
      video: V("QuAQZ5faoAE"), alts: [V("EK8OS6DZEwQ"), V("wsaQ8Z7TZJY")],
      cues: ["Wide stance, toes turned out", "Knees push out over toes", "Sink straight down, chest up"],
    },
    pulseSquat: {
      name: "Goblet Pulse Squat", dumbbells: 1, reps: "20 pulses", pattern: "squat",
      video: V("kK4O5YZYSG8", "wide"), alts: [V("-rQv_Lbn3Gk"), V("GFosoEmNAQA"), V("IrJBHdyZXFo")],
      cues: ["Squat down and stay low", "Small pulses at the bottom", "Keep weight in the heels"],
    },
    jumpSquat: {
      name: "Jump Squat", dumbbells: 0, reps: "10 reps", pattern: "squat",
      video: V("Kthqc3yyyK4"), alts: [V("36vnWAkL7ZQ"), V("h5TmdMMtIT4")],
      cues: ["Squat, then jump straight up", "Land softly, knees bent", "Reset each rep"],
      tip: "Skip the jump and rise to your toes instead",
    },
    cossackSquat: {
      name: "Cossack Squat", dumbbells: 0, reps: "6–8 reps each side", pattern: "squat",
      video: V("MJvazUpmdZU"), alts: [V("1EqGnNuUalk"), V("IACvsUqSqcA")],
      cues: ["Very wide stance", "Sit into one hip, other leg straight", "Go only as low as you can control"],
      tip: "Hold a dumbbell at your chest for balance once it's easy",
    },
    lateralSquatWalk: {
      name: "Lateral Squat Walk", dumbbells: 0, reps: "10 steps each way", pattern: "side",
      video: V("K0oHBV6w3T8"), alts: [V("ADXZdHAiFJg"), V("yaamXQLtB9M")],
      cues: ["Stay in a half squat", "Step wide to the side, then follow", "Don't bob up and down"],
    },

    // ---------- lunges / single leg ----------
    splitSquat: {
      name: "Split Squat", dumbbells: 2, reps: "8–10 reps each leg", pattern: "lunge",
      video: V("Wcmg-3iHwjQ", "wide"), alts: [V("qW2ps30p9m4"), V("iDbSKR6_jJQ")],
      cues: ["Long staggered stance, feet stay put", "Drop the back knee straight down", "Push up through the front foot"],
    },
    bulgarianSplitSquat: {
      name: "Bulgarian Split Squat", dumbbells: 2, reps: "8 reps each leg", pattern: "lunge",
      video: V("nll7MQwLNwo"), alts: [V("kHgMJOpDGRQ"), V("va6aW8jnNEM"), V("_r7FCi7e-Fw", "wide")],
      cues: ["Back foot on the couch or a chair", "Lean slightly forward for more glute", "Lower slowly, drive up through the front heel"],
      tip: "Bodyweight first, it's harder than it looks",
    },
    curtsyLunge: {
      name: "Curtsy Lunge", dumbbells: 2, reps: "8 reps each leg", pattern: "lunge",
      video: V("Y40n8JJ_Fu0", "wide"), alts: [V("NCzebKJUN8c"), V("9AXSxa-iB0w"), V("73udYXFW7dg")],
      cues: ["Step back and across, like a curtsy", "Front knee tracks over the toes", "Hips stay facing forward"],
    },
    lateralLunge: {
      name: "Lateral Lunge", dumbbells: 1, reps: "8 reps each side", pattern: "lunge",
      video: V("O8k_pNbSOVM"), alts: [V("mKL3k6buTe0"), V("guAKp7vHzqQ"), V("8ANwlFziwtk"), V("rngJ3yYCX6g")],
      cues: ["Big step to the side", "Sit back into that hip, other leg straight", "Push back to the middle"],
    },
    walkingLunge: {
      name: "Walking Lunge", dumbbells: 2, reps: "10 steps each leg", pattern: "lunge",
      video: V("8fZxWTiIJWo", "wide"), alts: [V("6B5pXXAd9OU"), V("2ea3_b9rFdM"), V("Tc1TsAdoDRo")],
      cues: ["Long step forward", "Back knee almost touches the floor", "Step through into the next lunge"],
      tip: "Needs a clear stretch of floor; do reverse lunges in place otherwise",
    },
    stepUp: {
      name: "Step-Up", dumbbells: 2, reps: "8 reps each leg", pattern: "lunge",
      video: V("abYz-R6YNXU"), alts: [V("OxWZ-G-RdCM"), V("6r0N8oaU4ko"), V("PzDbmqL6qo8")],
      cues: ["Sturdy stair or step", "Whole foot on the step", "Push through the top leg, don't jump off the bottom one"],
    },
    lungeKneeDrive: {
      name: "Reverse Lunge + Knee Drive", dumbbells: 0, reps: "8 reps each leg", pattern: "lunge",
      video: V("ZmoRvRrgBj0"), alts: [V("VA9z64mNSCw"), V("LryFP0rlPG0", "wide"), V("cUJc9ZaSqbU")],
      cues: ["Step back into a lunge", "Drive the back knee up as you stand", "Balance at the top for a beat"],
    },
    skaterSquat: {
      name: "Skater Squat", dumbbells: 0, reps: "6 reps each leg", pattern: "lunge",
      video: V("UBTnZaJS398"), alts: [V("XQyUlYxTGuM"), V("a9lx_T0f7yc", "wide"), V("_m0z8EgqlVY")],
      cues: ["Stand on one leg, other knee bent behind", "Lower the back knee toward the floor", "Reach arms forward to balance"],
      tip: "Hard! Put a pillow under the knee and go part way",
    },
    singleLegBoxSquat: {
      name: "Single-Leg Chair Squat", dumbbells: 0, reps: "6–8 reps each leg", pattern: "lunge",
      video: V("3vGZyXRZ298", "wide"), alts: [V("NxJz1BTiSnQ"), V("CX0OPjpkUBE")],
      cues: ["Stand in front of a chair on one leg", "Sit down slowly", "Stand back up on the same leg"],
    },

    // ---------- side glutes ----------
    fireHydrant: {
      name: "Fire Hydrant", dumbbells: 0, reps: "12 reps each side", pattern: "side",
      video: V("YJdQCJGsOGk"), alts: [V("Y0G0DqWsSuM"), V("IRkRgk2Gc1E", "wide"), V("oVSlEf9qj1A", "wide")],
      cues: ["On hands and knees", "Lift one bent knee out to the side", "Keep hips level, don't lean"],
    },
    clamshell: {
      name: "Clamshell", dumbbells: 0, reps: "15 reps each side", pattern: "side",
      video: V("r320kgGBBWs"), alts: [V("gFyIjunfbbg", "wide"), V("Fck2BoZ_dXo"), V("GhtIRFqClwE")],
      cues: ["Lie on your side, knees bent, feet together", "Open the top knee like a clam", "Don't roll the hips back"],
    },
    sideLyingLegRaise: {
      name: "Side-Lying Leg Raise", dumbbells: 0, reps: "12–15 reps each side", pattern: "side",
      video: V("L3Nlm_x3c6Q", "wide"), alts: [V("gvtJGZvZO8E"), V("DA4FVJH2PnU", "wide")],
      cues: ["Lie on your side, legs straight", "Lift the top leg, heel leads", "Slow on the way down"],
    },
    standingAbduction: {
      name: "Standing Hip Abduction", dumbbells: 0, reps: "15 reps each side", pattern: "side",
      video: V("-IlIs1LhVDY"), alts: [V("ITyJfMetA8s"), V("E36nkfxG15U"), V("qBqKuEQl9sI", "wide"), V("tfx_W3WJKks"), V("aJUtDmOtZC4")],
      cues: ["Stand tall, hand on a wall or chair", "Lift the leg out to the side", "Toes point forward, don't lean"],
    },
    sidePlankClam: {
      name: "Side Plank Clamshell", dumbbells: 0, reps: "10 reps each side", pattern: "side",
      video: V("a1xnrwNkMkA"), alts: [V("nxylkhcpRGM"), V("YBxfr3La96E", "wide"), V("d3zns5GlncI")],
      cues: ["Side plank on your elbow, knees bent", "Lift hips, then open the top knee", "Keep hips up the whole set"],
    },

    // ---------- glute isolation ----------
    donkeyKick: {
      name: "Donkey Kick", dumbbells: 0, reps: "12–15 reps each side", pattern: "kickback",
      video: V("SJ1Xuz9D-ZQ", "wide"), alts: [V("-mJAo1_zE7k"), V("KDmxshCrqA4"), V("JsDRMr1T7Is")],
      cues: ["On hands and knees", "Kick one bent leg up, sole to the ceiling", "Don't arch the lower back"],
    },
    standingKickback: {
      name: "Standing Glute Kickback", dumbbells: 0, reps: "15 reps each side", pattern: "kickback",
      video: V("I1eq_u2snYI"), alts: [V("13d3DCI_-BI"), V("wbsT9xBVewM"), V("iqP1OF0atKM")],
      cues: ["Hands on a wall or chair", "Kick one straight leg back", "Squeeze, don't swing"],
    },
    rainbowKick: {
      name: "Rainbow Kick", dumbbells: 0, reps: "10 reps each side", pattern: "kickback",
      video: V("okn5Jo0BdOk"), alts: [V("DYw8QTutJ60", "wide"), V("xg0qzjFcono")],
      cues: ["On hands and knees, one leg straight back", "Sweep the foot over in an arc to the other side", "Move slowly, hips steady"],
    },
    proneLegLift: {
      name: "Prone Leg Lift", dumbbells: 0, reps: "12–15 reps", pattern: "kickback",
      video: V("zKJWdP4jEOM", "wide"), alts: [V("F1utkqNL9hA"), V("XIfYC7xsInU")],
      cues: ["Lie face down, forehead on your hands", "Lift both legs a few inches", "Squeeze glutes, don't crank the back"],
    },
  };

  Object.assign(window.EXERCISES, NEW);
  // ---------- filling the muscle gaps: upper body without a bench, arms, calves, shins, hamstring curls, neck ----------
  // Every muscle in muscles.ts now has at least two moves where it is a main muscle, and the upper body has
  // no-weight options (push-ups, pike push-ups, dips, Y raises).
  const MORE: Record<string, Exercise> = {
    // push
    pushUp: {
      name: "Push-Up", dumbbells: 0, reps: "8–12 reps", pattern: "push",
      video: V("zUymek3A64A"), alts: [V("HHRDXEG1YCU"), V("-Oa88QNL1bc"), V("xyBTdZglfrY"), V("s1X8e4JFdbE", "wide")],
      cues: ["Hands a bit wider than shoulders", "Body straight from head to heels", "Elbows about 45° from your sides"],
      tip: "Too hard? Hands on the couch or a wall",
    },
    declinePushUp: {
      name: "Feet-Elevated Push-Up", dumbbells: 0, reps: "6–10 reps", pattern: "push",
      video: V("x3XztsyxHp4"), alts: [V("4aUUcfwyfE0", "wide"), V("VCfB2oUZzAA", "wide")],
      cues: ["Feet up on the couch or a step", "Brace so the hips don't sag", "Lower your chest, not your face"],
    },
    pikePushUp: {
      name: "Pike Push-Up", dumbbells: 0, reps: "6–10 reps", pattern: "push",
      video: V("rWnpH-RGdmA"), alts: [V("shEnAXgc9y4"), V("0cT6ug3WVn4"), V("RmKUhj62_9c")],
      cues: ["Hips high, upside-down V", "Lower the top of your head toward the floor", "Press back up through the shoulders"],
    },
    uprightRow: {
      name: "Upright Row", dumbbells: 2, reps: "10–12 reps", pattern: "push",
      video: V("g-Qn4yA0EB0"), alts: [V("CgAdfBs9JfA"), V("dkKwDrEcACU"), V("9caDgnuHh3U")],
      cues: ["Lead with the elbows", "Pull to chest height, no higher", "Dumbbells stay close to the body"],
    },
    frontRaise: {
      name: "Front Raise", dumbbells: 1, reps: "10–12 reps", pattern: "push",
      video: V("sOcYlBI85hc", "wide"), alts: [V("zHdB9-RGhRQ", "wide"), V("2oSVPyjO2nc", "wide"), V("iWeMzRCdj7o", "wide")],
      cues: ["One dumbbell in both hands, or one in each", "Raise to shoulder height", "No swinging, lower slowly"],
    },
    // pull
    pullover: {
      name: "Floor Pullover", dumbbells: 1, reps: "10–12 reps", pattern: "pull",
      video: V("fUDUiefmvRo"), alts: [V("qALakTR1nRI", "wide"), V("tM-RjVia9AY", "wide")],
      cues: ["Lie on your back, one dumbbell in both hands", "Arms almost straight, lower behind your head", "Pull it back over your chest"],
    },
    renegadeRow: {
      name: "Renegade Row", dumbbells: 2, reps: "6–8 reps each side", pattern: "pull",
      video: V("_4anOEYFxkY"), alts: [V("IuXWhgTUDUY"), V("YUMXGLL2IKE"), V("0Bh3oKgRsa8")],
      cues: ["Plank on the dumbbells, feet wide", "Row one to your hip", "Hips stay level, no twisting"],
    },
    proneYRaise: {
      name: "Prone Y Raise", dumbbells: 0, reps: "10–12 reps", pattern: "pull",
      video: V("dkPt_8o5qX0"), alts: [V("bCt9zE64Sdk"), V("QxZoPYmBFlg"), V("w1AWGKubE5U", "wide")],
      cues: ["Lie face down, arms in a Y", "Thumbs up, lift the arms", "Shoulder blades down and back"],
    },
    shrug: {
      name: "Dumbbell Shrug", dumbbells: 2, reps: "12–15 reps", pattern: "pull",
      video: V("zrs4FLeF_-4"), alts: [V("j2-RccWDhDo"), V("xiLT85G_GuU", "wide"), V("RLHxN6hq8NA", "wide")],
      cues: ["Dumbbells at your sides", "Shoulders straight up to the ears", "Pause, then lower slowly"],
    },
    // arms
    bicepsCurl: {
      name: "Biceps Curl", dumbbells: 2, reps: "10–12 reps", pattern: "arms",
      video: V("MKWBV29S6c0"), alts: [V("ykJmrZ5v0Oo", "wide"), V("6DeLZ6cbgWQ", "wide")],
      cues: ["Palms up, elbows by your sides", "Upper arms stay still", "Squeeze at the top, lower slowly"],
    },
    reverseCurl: {
      name: "Reverse Curl", dumbbells: 2, reps: "10–12 reps", pattern: "arms",
      video: V("KakQSkPr1YQ"), alts: [V("_xCCJi25Ei8", "wide"), V("CIGPx1bx0Hs", "wide")],
      cues: ["Palms facing down", "Curl with the elbows tucked", "Wrists stay straight"],
    },
    wristCurl: {
      name: "Wrist Curl", dumbbells: 1, reps: "15 reps each side", pattern: "arms",
      video: V("M8TpHw5aYgA"), alts: [V("kEXbp67nJDc", "wide"), V("CyUPGYlL2D4", "wide"), V("xENVg7RX_O8")],
      cues: ["Forearm on your thigh, wrist past the knee", "Curl the dumbbell up with the wrist only", "Full stretch at the bottom"],
    },
    skullCrusher: {
      name: "Floor Skull Crusher", dumbbells: 2, reps: "10–12 reps", pattern: "arms",
      video: V("dXcA5PDXDq4"), alts: [V("sMJpkpCpEXw"), V("W7j2dnr5lHs", "wide"), V("Dzko6yfu_2w", "wide")],
      cues: ["Lie on your back, dumbbells over your shoulders", "Bend only the elbows, weights beside your head", "Straighten the arms back up"],
    },
    kickback: {
      name: "Triceps Kickback", dumbbells: 1, reps: "10–12 reps each side", pattern: "arms",
      video: V("SKPfoxFc6VE"), alts: [V("xi806yP2EIE", "wide"), V("ShCYaoHmWmk", "wide")],
      cues: ["Hinge forward, upper arm by your side", "Straighten the elbow back", "Only the forearm moves"],
    },
    chairDip: {
      name: "Chair Dip", dumbbells: 0, reps: "8–12 reps", pattern: "arms",
      video: V("jDafIn0WMUw"), alts: [V("0326dy_-CzM"), V("CVj69WdL0bk", "wide")],
      cues: ["Hands on a sturdy chair behind you", "Lower until the elbows reach 90°", "Shoulders down, body close to the chair"],
    },
    // core
    plank: {
      name: "Plank", dumbbells: 0, reps: "30 sec", pattern: "core", timed: { seconds: 30, sides: ["Hold the plank"] },
      video: V("nVIeqNLGLa0"), alts: [V("9j8-dM55J0M"), V("DA4GVdjoczs"), V("6xWUlLvltvQ")],
      cues: ["Elbows under the shoulders", "Squeeze glutes, ribs down", "Straight line, breathe"],
    },
    legRaise: {
      name: "Lying Leg Raise", dumbbells: 0, reps: "10–12 reps", pattern: "core",
      video: V("4a5pNSb12ok"), alts: [V("SuIxXbKnwx4", "wide"), V("_aUybhb3lZI", "wide")],
      cues: ["Lie on your back, hands under your hips", "Raise straight legs to vertical", "Lower slowly, low back stays down"],
    },
    kneeTuck: {
      name: "Seated Knee Tuck", dumbbells: 0, reps: "12–15 reps", pattern: "core",
      video: V("MJscXnIaFWo"), alts: [V("d_up4yEZhFI", "wide"), V("7emz03H7-Bo", "wide")],
      cues: ["Sit on the edge of a chair or the floor, lean back", "Pull the knees in to your chest", "Reach the legs out without touching down"],
    },
    superman: {
      name: "Superman", dumbbells: 0, reps: "10 reps, 2-sec hold", pattern: "core",
      video: V("HPFQf4cubhE"), alts: [V("z6PJMT2y8GQ"), V("hhq86gJvrvo", "wide")],
      cues: ["Lie face down, arms forward", "Lift arms, chest and legs together", "Hold, then lower slowly"],
    },
    farmersCarry: {
      name: "Farmer's Carry", dumbbells: 2, reps: "30 sec", pattern: "core", timed: { seconds: 30, sides: ["Walk tall"] },
      video: V("hpmLi1Vl13U"), alts: [V("5QclP8MicNU", "wide"), V("AXOrMG1rwu0", "wide")],
      cues: ["Heavy dumbbell in each hand", "Stand tall, shoulders back", "Short steady steps, don't lean"],
    },
    // lower legs and leg isolation
    calfRaise: {
      name: "Standing Calf Raise", dumbbells: 1, reps: "15 reps", pattern: "calf",
      video: V("C8gR_i25oI0"), alts: [V("HvvqTpTongY", "wide"), V("hPA98_r-6e4", "wide")],
      cues: ["Balls of the feet on a step, heels hanging", "Rise all the way up", "Lower slowly into a stretch"],
    },
    seatedCalfRaise: {
      name: "Seated Calf Raise", dumbbells: 2, reps: "15–20 reps", pattern: "calf",
      video: V("B5MKjeSeM7g"), alts: [V("4-slnRXcGDc", "wide"), V("uknziZ8i1xk"), V("WGLkpfS5ULE")],
      cues: ["Sit with dumbbells on your knees", "Toes on a book or step", "Lift the heels high, lower slowly"],
    },
    tibialisRaise: {
      name: "Wall Tibialis Raise", dumbbells: 0, reps: "15–20 reps", pattern: "calf",
      video: V("h57xceuiO40"), alts: [V("lNpConytJN0"), V("blH9X986nT8"), V("VzIcGAgBiaM", "wide")],
      cues: ["Back against a wall, feet out in front", "Lift your toes as high as you can", "Lower slowly, don't slap them down"],
    },
    sliderCurl: {
      name: "Towel Hamstring Curl", dumbbells: 0, reps: "8–12 reps", pattern: "legiso",
      video: V("lVQ-klj7e1Q"), alts: [V("TtCGepVWDQc"), V("cWSsWpuxmYM", "wide"), V("IjFnVz0nR5s", "wide")],
      cues: ["On your back, heels on a towel on a smooth floor", "Hips up in a bridge", "Slide the heels out and pull them back in"],
    },
    legCurl: {
      name: "Lying Dumbbell Leg Curl", dumbbells: 1, reps: "10–12 reps", pattern: "legiso",
      video: V("vzla60tdjq0"), alts: [V("zNml2HXif4Y", "wide"), V("ZHlBSI6JPsA", "wide")],
      cues: ["Lie face down, dumbbell between your feet", "Curl the heels toward your glutes", "Lower slowly, don't let it drop"],
    },
    legExtension: {
      name: "Seated Leg Extension", dumbbells: 1, reps: "12–15 reps", pattern: "legiso",
      video: V("6t01IIEpm3k"), alts: [V("HpCE66lfEuk"), V("LsHXi8tU0Zc", "wide")],
      cues: ["Sit on a high chair or couch edge", "Dumbbell held between your feet", "Straighten the knees, squeeze, lower slowly"],
    },
    // neck
    neckIso: {
      name: "Neck Isometric Holds", dumbbells: 0, reps: "4 × 10 sec", pattern: "neck",
      timed: { seconds: 10, sides: ["Push forward into your hand", "Push back into your hands", "Push left into your hand", "Push right into your hand"] },
      video: V("g-xefX0gOTo"), alts: [V("brkZW0fdc5k", "wide"), V("kMAlwI-aS18", "wide")],
      cues: ["Hand against your head", "Push gently, head doesn't move", "Easy pressure, no pain"],
    },
    neckCurl: {
      name: "Lying Neck Curl", dumbbells: 0, reps: "10–12 reps", pattern: "neck",
      video: V("lRKWP2LzCmw", "wide"), alts: [V("IvrkmCrQnQE", "wide"), V("RHhaq5q7_mM", "wide")],
      cues: ["Lie on your back, knees bent", "Tuck the chin, lift the head slightly", "Hold a moment, lower slowly"],
    },
    // second dumbbell options for muscles that had only one main move
    reverseGripPress: {
      name: "Reverse-Grip Floor Press", dumbbells: 2, reps: "10–12 reps", pattern: "push",
      video: V("njKHXAcPEtY"), alts: [V("aMEvoVlmMEg", "wide"), V("G0uxeMB8_xg", "wide"), V("g8OD0teBMb8", "wide")],
      cues: ["Lie on your back, palms facing your face", "Elbows tucked close to your sides", "Press up and slightly back over the chest"],
    },
    dragCurl: {
      name: "Drag Curl", dumbbells: 2, reps: "10–12 reps", pattern: "arms",
      video: V("_xfyZ906IsU", "wide"), alts: [V("91hCx3V6Ueo", "wide")],
      cues: ["Palms up, dumbbells at your thighs", "Drag them up your body, elbows go back", "Squeeze at the top, lower slowly"],
    },
    sissySquat: {
      name: "Dumbbell Sissy Squat", dumbbells: 1, reps: "8–10 reps", pattern: "legiso",
      video: V("bL91QcnUg8U", "wide"), alts: [V("8cwhoomX_aY", "wide"), V("ppTKqvnM7Kg", "wide")],
      cues: ["Hold a chair with one hand, dumbbell at your chest", "Rise onto your toes, knees travel forward", "Lean back as you lower, straight line knees to head"],
      tip: "Too hard? Skip the dumbbell and go half depth",
    },
    singleLegCalfRaise: {
      name: "Single-Leg Calf Raise", dumbbells: 1, reps: "10–12 reps each leg", pattern: "calf",
      video: V("1D7s-VyLq0Y", "wide"), alts: [V("KcTEGifMTDY", "wide"), V("PTn6icEeH3Y", "wide"), V("lYfI9gd3A8o", "wide")],
      cues: ["One foot on a step, dumbbell in the same-side hand", "Other hand on a wall", "Full stretch down, all the way up"],
    },
    bentKneeCalfRaise: {
      name: "Bent-Knee Calf Raise", dumbbells: 2, reps: "15 reps", pattern: "calf",
      video: V("T4UsIAe7WnM", "wide"), alts: [V("C3tLEvqrW4E", "wide"), V("hNV0vvXEA28", "wide")],
      cues: ["Dumbbells at your sides, knees bent a little", "Keep the bend as you rise", "Up on the toes, lower slowly"],
    },
    dbTibRaise: {
      name: "Seated Dumbbell Tib Raise", dumbbells: 1, reps: "15 reps", pattern: "calf",
      video: V("xs7wTPl28CE", "wide"), alts: [V("qjKcWZB_eoA", "wide"), V("CF8Kbm44uK4", "wide"), V("gO-KnFIDmLY", "wide")],
      cues: ["Sit high, light dumbbell on your toes or between the feet", "Pull the toes up toward the shins", "Slow on the way down"],
    },
  };
  Object.assign(window.EXERCISES, MORE);


  // Tags for the existing program moves so the builder can use them too.
  const TAGS: Record<string, string> = {
    gobletSquat: "squat", rdl: "hinge", reverseLunge: "lunge", gluteBridge: "bridge", birdDog: "kickback",
    suitcaseMarch: "core", deadBug: "core", russianTwist: "core",
    floorPress: "push", overheadPress: "push", floorFly: "push", lateralRaise: "push", tricepsExtension: "arms",
    bentOverRow: "pull", oneArmRow: "pull", rearDeltFly: "pull", hammerCurl: "arms", concentrationCurl: "arms",
  };
  for (const [k, p] of Object.entries(TAGS)) window.EXERCISES[k].pattern = p;
})();
