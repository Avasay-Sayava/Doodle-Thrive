import { Stack, useSegments, useRouter } from "expo-router";

function AuthNav() {
  const router = useRouter();
  const segments = useSegments();

  if (!segments[1]) {
    router.replace("/(auth)/signin");
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}

export default function Layout() {
  return <AuthNav />;
}
