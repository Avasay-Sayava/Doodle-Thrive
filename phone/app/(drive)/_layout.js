import { Slot, useSegments, useRouter } from "expo-router";
import { Suspense, useEffect } from "react";
import LoadingScreen from "@/src/components/common/LoadingScreen";

function Drive() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!segments[1] || segments[1] === "index") {
      router.replace("/(drive)/(tabs)");
    }
  }, [segments, router]);

  return <Slot />;
}

export default function DriveLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Drive />
    </Suspense>
  );
}
