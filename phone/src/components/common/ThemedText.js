import { Text } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { styles } from "@/styles/components/common/ThemedText.styles";

export default function ThemedText({ style, ...props }) {
  const { theme } = useTheme();
  const defaultStyle = useMemo(() => styles(theme), [theme]);

  return (
    <Text
      style={[defaultStyle.text, style]}
      {...props}
    />
  );
}
