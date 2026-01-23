import { Slot } from "expo-router";
import { Suspense } from "react";
import LoadingScreen from "@/src/components/common/LoadingScreen";

function Drive() {
  return <Slot />;
}

export default function DriveLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Drive />
    </Suspense>
  );
}
