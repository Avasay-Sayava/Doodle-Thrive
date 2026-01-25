import { Slot, useSegments, useRouter } from "expo-router";
import { Suspense, useEffect, useRef, createContext } from "react";
import LoadingScreen from "@/src/components/common/LoadingScreen";

export const AuthFormsContext = createContext(null);

function Auth() {
  const router = useRouter();
  const segments = useSegments();

  const usernameRef = useRef("");
  const passwordRef = useRef("");

  useEffect(() => {
    if (!segments[1] || segments[1] === "index") {
      router.replace("/(auth)/signin");
    }
  }, [segments, router]);

  return (
    <AuthFormsContext.Provider
      value={{
        usernameRef: usernameRef,
        passwordRef: passwordRef,
      }}
    >
      <Slot />
    </AuthFormsContext.Provider>
  );
}

export default function AuthLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Auth />
    </Suspense>
  );
}
