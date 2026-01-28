import { Stack } from "expo-router";
import { Suspense } from "react";
import LoadingScreen from "@/src/components/common/LoadingScreen";

export default function ScreensLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="recent" />
        <Stack.Screen name="rickroll" />
        <Stack.Screen name="search" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="trash" />
      </Stack>
    </Suspense>
  );
}
