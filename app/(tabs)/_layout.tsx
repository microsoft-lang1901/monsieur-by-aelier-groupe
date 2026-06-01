import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colors, typography } from "@/theme/tokens";

type TabIconName = keyof typeof Ionicons.glyphMap;

const tabIcons: Record<string, TabIconName> = {
  index: "home-outline",
  collections: "albums-outline",
  search: "search-outline",
  wardrobe: "file-tray-full-outline",
  account: "person-outline"
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.stone,
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopColor: colors.line,
          minHeight: 64
        },
        tabBarLabelStyle: {
          ...typography.label,
          fontSize: 10
        },
        headerStyle: { backgroundColor: colors.ivory },
        headerTintColor: colors.ink,
        headerTitleStyle: { fontFamily: "serif" },
        tabBarIcon: ({ color, size }) => <Ionicons name={tabIcons[route.name] ?? "ellipse-outline"} size={size} color={color} />
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="collections" options={{ title: "Collections" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="wardrobe" options={{ title: "Wardrobe" }} />
      <Tabs.Screen name="account" options={{ title: "Account" }} />
    </Tabs>
  );
}
