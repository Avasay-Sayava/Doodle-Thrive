import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { styles } from "@/styles/components/drive/screens/settings.styles";
import ThemedText from "@/src/components/common/ThemedText";

export default function Settings() {
  const { theme, change } = useTheme();

  const style = useMemo(() => styles({ theme }), [theme]);

  const handleToggleTheme = () => {
    const nextTheme = theme.dark ? "pink" : "soviet";
    change(nextTheme);
  };

  return (
    <View style={style.container}>
      <ThemedText style={style.subtitle}>Visuals</ThemedText>
      <TouchableOpacity
        style={style.button}
        activeOpacity={0.7}
        onPress={handleToggleTheme}
      >
        <ThemedText style={style.buttonText}>Theme</ThemedText>
        <ThemedText style={style.buttonNote}>
          {theme.dark ? "Soviet" : "Pink"}
        </ThemedText>
      </TouchableOpacity>

      <ThemedText style={style.subtitle}>Privacy</ThemedText>
      <TouchableOpacity
        style={style.button}
        activeOpacity={0.7}
        onPress={() => Alert.alert("Already sold to China.")}
      >
        <ThemedText style={style.buttonText}>Enable Privacy Mode</ThemedText>
        <ThemedText style={style.buttonNote}>Disabled</ThemedText>
      </TouchableOpacity>
    </View>
  );
}
