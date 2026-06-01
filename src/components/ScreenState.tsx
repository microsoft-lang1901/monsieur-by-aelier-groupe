import { Text, View } from "react-native";
import { sharedStyles } from "@/theme/styles";
import { colors, spacing, typography } from "@/theme/tokens";

type ScreenStateProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export function ScreenState({ eyebrow, title, body }: ScreenStateProps) {
  return (
    <View style={[sharedStyles.constrained, { gap: spacing.md }]}>
      <Text style={sharedStyles.label}>{eyebrow}</Text>
      <Text style={sharedStyles.title}>{title}</Text>
      <Text style={[typography.body, { color: colors.espresso }]}>{body}</Text>
    </View>
  );
}
