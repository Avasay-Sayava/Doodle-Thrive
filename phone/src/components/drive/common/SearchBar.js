import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { TextInput, View } from "react-native";
import { styles } from "@/styles/components/drive/common/SearchBar.styles";
import Icon from "@/src/components/common/Icon";

export default function SearchBar({ value, onChangeText, placeholder }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  return (
    <View style={style.container}>
      <View style={style.searchContainer}>
        <Icon
          name="search"
          size={style.icon.fontSize}
          color={style.icon.color}
        />
        <TextInput
          style={style.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          autoFocus={true}
        />
      </View>
    </View>
  );
}
