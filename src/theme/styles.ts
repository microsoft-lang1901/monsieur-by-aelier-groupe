import { StyleSheet } from "react-native";
import { colors, radius, spacing, tapTarget, typography } from "./tokens";

export const sharedStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ivory
  },
  scrollContent: {
    paddingBottom: spacing.xxl
  },
  constrained: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl
  },
  label: {
    ...typography.label,
    color: colors.muted,
    textTransform: "uppercase"
  },
  title: {
    ...typography.displayTitle,
    color: colors.ink
  },
  body: {
    ...typography.body,
    color: colors.espresso
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.line
  },
  primaryButton: {
    minHeight: tapTarget.minimum,
    borderRadius: radius.sm,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  primaryButtonText: {
    ...typography.cta,
    color: colors.paper,
    textTransform: "uppercase"
  },
  secondaryButton: {
    minHeight: tapTarget.minimum,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  secondaryButtonText: {
    ...typography.cta,
    color: colors.ink,
    textTransform: "uppercase"
  }
});
