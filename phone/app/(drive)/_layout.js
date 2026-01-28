import { Slot, useSegments, useRouter } from "expo-router";
import { Suspense, useEffect } from "react";
import LoadingScreen from "@/src/components/common/LoadingScreen";
import { View } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";

function Drive() {
  const { theme } = useTheme();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!segments[1] || segments[1] === "index") {
      router.replace("/(drive)/(tabs)");
    }
  }, [segments, router]);

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Slot />
    </View>
  );
}

export default function DriveLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Drive />
    </Suspense>
  );
}
