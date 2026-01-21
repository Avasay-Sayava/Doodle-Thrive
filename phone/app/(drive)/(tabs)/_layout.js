import { Tabs as Stack } from "expo-router";
import { Suspense } from "react";
import { useTheme } from "@/src/contexts/ThemeContext";
import LoadingScreen from "@/src/components/common/LoadingScreen";

function Tabs() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.card },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      <Stack.Screen name="index" options={{ href: null }} />
      <Stack.Screen name="home" options={{ title: "Home" }} />
      <Stack.Screen name="files" options={{ title: "Files" }} />
      <Stack.Screen name="shared" options={{ title: "Shared" }} />
      <Stack.Screen name="starred" options={{ title: "Starred" }} />
    </Stack>
  );
}

export default function TabsLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Tabs />
    </Suspense>
  );
}
