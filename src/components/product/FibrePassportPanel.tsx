import { Text, View } from "react-native";
import type { FibrePassport } from "@/domain/products";
import { sharedStyles } from "@/theme/styles";
import { colors, spacing, typography } from "@/theme/tokens";

type FibrePassportPanelProps = {
  passport: FibrePassport;
};

export function FibrePassportPanel({ passport }: FibrePassportPanelProps) {
  const rows = [
    ["Composition", passport.composition],
    ["Origin Region", passport.originRegion],
    ["Construction", passport.constructionMethod],
    ["Garment Weight", passport.garmentWeight],
    ["Gauge", passport.gauge],
    ["Micron Count", passport.micronCount],
    ["Traceability", passport.traceabilityStatement]
  ];

  return (
    <View style={{ gap: spacing.md }}>
      <Text style={sharedStyles.label}>Fibre Passport</Text>
      {rows.map(([label, value]) => (
        <View key={label} style={{ gap: spacing.xs }}>
          <Text style={[typography.label, { color: colors.muted, textTransform: "uppercase" }]}>{label}</Text>
          <Text style={[typography.body, { color: colors.espresso }]}>{value}</Text>
        </View>
      ))}
    </View>
  );
}
