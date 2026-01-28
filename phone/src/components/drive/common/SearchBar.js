import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { TextInput, View } from "react-native";
import { styles } from "@/styles/components/drive/common/SearchBar.styles";

export default function SearchBar({ value, onChangeText, placeholder }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  return (
    <View style={style.container}>
      <TextInput
        style={style.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
      />
    </View>
  );
}
