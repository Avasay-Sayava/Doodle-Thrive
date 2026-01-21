import { Slot } from "expo-router";
import { Suspense } from "react";
import LoadingScreen from "@/src/components/common/LoadingScreen";

export default function DriveLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Slot />
    </Suspense>
  );
}
