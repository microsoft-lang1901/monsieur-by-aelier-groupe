export const colors = {
  ivory: "#F6F1EA",
  paper: "#FBF8F2",
  ivoryOverlay: "rgba(246,241,234,0.78)",
  taupe: "#B8AEA2",
  stone: "#8D877E",
  espresso: "#2F2923",
  ink: "#171716",
  olive: "#3D4037",
  line: "#D8D0C5",
  muted: "#69635C",
  success: "#3D4037",
  warning: "#8D877E"
} as const;

export const typography = {
  displayHero: { fontFamily: "serif", fontSize: 42, lineHeight: 50, letterSpacing: 0 },
  displayTitle: { fontFamily: "serif", fontSize: 30, lineHeight: 38, letterSpacing: 0 },
  productName: { fontFamily: "serif", fontSize: 22, lineHeight: 30, letterSpacing: 0 },
  productPrice: { fontFamily: "serif", fontSize: 16, lineHeight: 22, letterSpacing: 0 },
  editorialLead: { fontFamily: "serif", fontSize: 20, lineHeight: 30, letterSpacing: 0 },
  body: { fontFamily: "system", fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  label: { fontFamily: "system", fontSize: 12, lineHeight: 16, letterSpacing: 1.6 },
  cta: { fontFamily: "system", fontSize: 13, lineHeight: 18, letterSpacing: 1.4 }
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
} as const;

export const radius = {
  none: 0,
  sm: 4,
  md: 8
} as const;

export const motion = {
  fade: { duration: 180 },
  fadeUp: { duration: 240 },
  expand: { duration: 220 },
  crossDissolve: { duration: 260 }
} as const;

export const tapTarget = {
  minimum: 44
} as const;

export type ColorToken = keyof typeof colors;
