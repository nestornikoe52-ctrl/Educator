export const colors = {
  ink: "#1a1714",
  muted: "#5e574e",
  paper: "#f3eee4",
  card: "#fffdf8",
  line: "#e3d9c6",
  green: "#0e6b45",
  greenDeep: "#073d28",
  gold: "#e2b340",
  maths: "#0e6b45",
  pct: "#b86e00",
  svt: "#1d6a78",
} as const;

export const subjectColor = {
  MATHEMATIQUES: colors.maths,
  PCT: colors.pct,
  SVT: colors.svt,
} as const;
