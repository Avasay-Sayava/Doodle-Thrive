import { ActivityIndicator, View } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles } from "@/styles/components/common/LoadingScreen.styles";
import { useMemo } from "react";

export default function LoadingScreen() {
  const { theme } = useTheme();
  const style = useMemo(() => styles(theme), [theme]);

  return (
    <View style={style.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}
