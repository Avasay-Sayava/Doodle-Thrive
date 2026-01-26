import { Slot, useSegments, useRouter } from "expo-router";
import { Suspense, useEffect, useRef, createContext } from "react";
import LoadingScreen from "@/src/components/common/LoadingScreen";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <AuthFormsContext.Provider
          value={{
            usernameRef: usernameRef,
            passwordRef: passwordRef,
          }}
        >
          <Slot />
        </AuthFormsContext.Provider>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function AuthLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Auth />
    </Suspense>
  );
}
