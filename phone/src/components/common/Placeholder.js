import { View } from "react-native";
import ThemedText from "@/src/components/common/ThemedText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { styles } from "@/styles/components/drive/common/Placeholder.styles";

export default function Placeholder() {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  return (
    <View style={style.container}>
      <ThemedText>Placeholder, Not Implemented Yet.</ThemedText>
    </View>
  );
}
