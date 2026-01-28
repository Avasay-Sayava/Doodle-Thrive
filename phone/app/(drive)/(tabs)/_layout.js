import { Tabs as Stack, useRouter, useSegments } from "expo-router";
import { Suspense, useEffect, useMemo } from "react";
import { useTheme } from "@/src/contexts/ThemeContext";
import LoadingScreen from "@/src/components/common/LoadingScreen";
import Header from "@/src/components/drive/tabs/header/Header";
import { View } from "react-native";
import { styles } from "@/styles/app/(drive)/(tabs)/_layout.styles";
import New from "@/src/components/drive/tabs/New";

function Tabs() {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!segments[2] || segments[2] === "index") {
      router.replace("/(drive)/(tabs)/home");
    }
  }, [segments, router]);

  return (
    <View style={style.fill}>
      <Header />
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
        <Stack.Screen name="starred" options={{ title: "Starred" }} />
        <Stack.Screen name="shared" options={{ title: "Shared" }} />
        <Stack.Screen name="files" options={{ title: "Files" }} />
      </Stack>
      <New />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Tabs />
    </Suspense>
  );
}
