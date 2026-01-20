import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useMemo } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/src/contexts/ThemeContext";
import { styles } from "@/styles/app/_layout.styles";

function RootNav() {
  const { jwt, loading: authLoading, error: authError, signout } = useAuth();
  const { theme, loading: themeLoading, error: themeError } = useTheme();

  const segments = useSegments();
  const router = useRouter();

  const style = useMemo(() => styles(theme), [theme]);

  const loading = authLoading || themeLoading;

  useEffect(() => {
    if (loading || authError || themeError) return;

    const inAuth = segments[0] === "(auth)";

    if (!jwt && !inAuth) {
      router.replace("/(auth)");
    } else if (jwt && inAuth) {
      router.replace("/(drive)");
    }
  }, [jwt, loading, authError, themeError, segments]);

  if (themeError) {
    return (
      <View style={style.centered}>
        <Text style={style.errorText}>
          {themeError.message || "Critical System Error: Unable to load theme."}
        </Text>
        <TouchableOpacity onPress={signout} style={style.retryButton}>
          <Text style={style.buttonText}>Reset App</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={style.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (authError) {
    return (
      <View style={style.centered}>
        <Text style={style.errorText}>
          {authError.message || "An unexpected authentication error occurred."}
        </Text>

        <TouchableOpacity onPress={signout} style={style.retryButton}>
          <Text style={style.buttonText}>Sign Out & Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(drive)" />
    </Stack>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNav />
      </AuthProvider>
    </ThemeProvider>
  );
}
