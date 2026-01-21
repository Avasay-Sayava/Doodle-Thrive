import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { useEffect, useMemo, Suspense, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ErrorBoundary } from "react-error-boundary";
import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/src/contexts/ThemeContext";
import LoadingScreen from "@/src/components/common/LoadingScreen";
import ErrorFallback from "@/src/components/common/ErrorFallback";
import { styles } from "@/styles/app/_layout.styles";

function Root() {
  const { jwt, loading: authLoading } = useAuth();
  const { theme, loading: themeLoading } = useTheme();
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const style = useMemo(() => styles(theme), [theme]);

  useEffect(() => {
    if (!navigationState?.key || authLoading || themeLoading) return;

    const inAuth = segments[0] === "(auth)";
    if (!jwt && !inAuth) router.replace("/(auth)");
    else if (jwt && inAuth) router.replace("/(drive)");
    else setLoading(false);
  }, [jwt, segments, navigationState?.key, authLoading, themeLoading]);

  useEffect(() => {
    if (authLoading || themeLoading) setLoading(true);
  }, [authLoading, themeLoading]);

  return (
    <>
      <View style={style.root}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(drive)" />
        </Stack>
      </View>

      {loading && (
        <View style={[StyleSheet.absoluteFill, style.loadingOverlay]}>
          <LoadingScreen />
        </View>
      )}
    </>
  );
}

function Boundary() {
  const { error: authError, signout } = useAuth();
  const { error: themeError } = useTheme();

  if (authError) throw authError;
  if (themeError) throw themeError;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={signout}>
      <Suspense fallback={<LoadingScreen />}>
        <Root />
      </Suspense>
    </ErrorBoundary>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Boundary />
      </AuthProvider>
    </ThemeProvider>
  );
}
