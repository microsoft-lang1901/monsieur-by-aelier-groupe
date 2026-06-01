import { Pressable, Text } from "react-native";
import { sharedStyles } from "@/theme/styles";

type PrimaryCTAProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function PrimaryCTA({ label, onPress, accessibilityLabel }: PrimaryCTAProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [sharedStyles.primaryButton, { opacity: pressed ? 0.82 : 1 }]}
    >
      <Text style={sharedStyles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}
