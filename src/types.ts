/** Shared domain types for the browser app. */
type VideoShape = "tall" | "wide";
interface ExerciseVideo { id: string; shape: VideoShape }
interface Exercise {
  name: string;
  dumbbells: number;
  reps: string;
  /** main and secondary muscles (ids in MUSCLES); filled in by muscles.ts */
  primary?: string[];
  secondary?: string[];
  /** stabilizer groups challenged (ids in STABILIZERS); filled in by muscles.ts */
  stab?: string[];
  cues: string[];
  video: ExerciseVideo;
  alts: ExerciseVideo[];
  tip?: string;
  timed?: { seconds: number; sides: string[] };
  pattern?: string;
  areas?: string[];
  level?: number;
  flags?: string[];
}
interface Muscle { name: string; sci: string; group: string; tier: number; area: string; regions: string[]; does: string }
interface Stabilizer { name: string; does: string }
interface CoverageLevel { n: number; name: string; blurb: string }
interface MuscleModel {
  LEVELS: CoverageLevel[];
  targets(level: number, areas?: string[]): string[];
  reach(moves: string[]): { pri: Set<string>; any: Set<string> };
  volume(moves: string[], rounds?: number): Record<string, number>;
  coverage(moves: string[], targets: string[]): number;
  label(target: string): string;
}
interface WorkoutDay {
  n?: number | null;
  title: string;
  color: string;
  moves: string[];
  focus?: string;
  tpl?: string;
  custom?: string;
  menu?: boolean;
  plan?: boolean;
}
type PlanFocus = "balanced" | "booty" | "lower" | "upper";
interface PlanAnswers {
  level: string;
  focus: PlanFocus;
  perWeek: number;
  dumbbells: number;
  moves: number;
  skip: string[];
  variety: string;
  likes?: string[];
  dislikes?: string[];
  [key: string]: any;
}
interface WorkoutPlan {
  id: string;
  answers: PlanAnswers;
  days: WorkoutDay[];
  week: string;
  created: string;
}
interface PlanTemplate { title: string; color: string; slots: string[][] }
interface PlannerApi {
  generate(answers: PlanAnswers): WorkoutPlan;
  regenerateDay(plan: WorkoutPlan, index: number): void;
  weeklySwap(plan: WorkoutPlan): void;
  weekKey(date: Date): string;
  rotationFor(answers: PlanAnswers): string[];
  allowed(key: string, answers: PlanAnswers): boolean;
  maxLevel(answers: PlanAnswers): number;
  TEMPLATES: Record<string, PlanTemplate>;
  FLAGS: Record<string, string[]>;
}
interface WorkoutSettings {
  rounds: number;
  rest: number;
  beeps: boolean;
  sound: boolean;
  coach: "any" | "f" | "m";
}
interface WorkoutHistory {
  day?: number | null;
  prog?: string | null;
  custom?: string;
  title?: string;
  color?: string;
  moves?: number;
  rounds?: number;
  date: string;
  minutes?: number;
  feel?: string;
}
interface SavedSet { id: string; name: string; area: string; color: string; moves: string[] }
interface MenuItem {
  kind: "area" | "set";
  id: string;
  name: string;
  color: string;
  moves?: string[];
  area?: string;
  blurb?: string;
}
interface WizardState { step: number; cur: number; answers: PlanAnswers; draft: WorkoutPlan | null }
type WorkoutStep =
  | { type: "work"; key: string; round: number; idx: number }
  | { type: "rest"; label: string; secs: number; next: string; round: number; idx: number };
interface WorkoutSession {
  day: WorkoutDay;
  rounds: number;
  steps: WorkoutStep[];
  i: number;
  paused: boolean;
  started: number;
  spaceBlockUntil: number;
  remaining?: number | null;
  side?: number;
  lastBeepSec?: number | null;
}
/** Shared shape for static HTML elements queried by their IDs. */
type UIElement = HTMLElement & HTMLImageElement & HTMLInputElement & HTMLButtonElement;
interface Window {
  EXERCISES: Record<string, Exercise>;
  MUSCLES: Record<string, Muscle>;
  MUSCLE_GROUPS: Record<string, string>;
  STABILIZERS: Record<string, Stabilizer>;
  MUSCLE_MODEL: MuscleModel;
  DAYS: WorkoutDay[];
  RULES: string[];
  PRESENTER: Record<string, "m" | "f">;
  BODY_MAP: Record<"front" | "back", Array<[string, string[]]>>;
  PLANNER: PlannerApi;
  __bodyMap: (primary: string[], secondary: string[]) => string;
  __workout: unknown;
  onYouTubeIframeAPIReady: () => void;
  webkitAudioContext?: typeof AudioContext;
}
/** Minimal declarations for the external YouTube IFrame Player API. */
declare namespace YT {
  interface PlayerEvent { target: Player }
  interface StateEvent extends PlayerEvent { data: number }
  interface PlayerOptions {
    host?: string;
    videoId?: string;
    playerVars?: Record<string, string | number>;
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: StateEvent) => void;
      onError?: (event: unknown) => void;
    };
  }
  class Player {
    constructor(element: string | HTMLElement, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    loadVideoById(id: string): void;
    cueVideoById(id: string): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    mute(): void;
    unMute(): void;
    setVolume(volume: number): void;
    destroy(): void;
  }
  const PlayerState: { PLAYING: number; ENDED: number };
}
