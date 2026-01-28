import { Slot, useRouter } from "expo-router";
import { Suspense, useMemo } from "react";
import LoadingScreen from "@/src/components/common/LoadingScreen";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles } from "@/styles/app/(drive)/(screens).styles";
import { TouchableOpacity, View } from "react-native";
import ThemedText from "@/src/components/common/ThemedText";

export default function ScreensLayout() {
  const router = useRouter();
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const goBack = () => {
    router.replace("(drive)/(tabs)");
  };

  return (
    <Suspense fallback={<LoadingScreen />}>
      <View style={style.container}>
        <View style={style.header}>
          <TouchableOpacity onPress={goBack}>
            <ThemedText style={style.backButton}>Back</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={style.content}>
          <Slot />
        </View>
      </View>
    </Suspense>
  );
}
