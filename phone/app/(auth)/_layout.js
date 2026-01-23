import { Slot, useSegments, useRouter } from "expo-router";
import { Suspense, useEffect } from "react";
import LoadingScreen from "@/src/components/common/LoadingScreen";

function Auth() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!segments[1] || segments[1] === "index") {
      router.replace("/(auth)/signin");
    }
  }, [segments, router]);

  return <Slot />;
}

export default function AuthLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Auth />
    </Suspense>
  );
}
