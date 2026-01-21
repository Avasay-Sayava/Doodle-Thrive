import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { styles } from "@/styles/components/common/ErrorFallback.styles";

export default function ErrorFallback({ error, resetErrorBoundary }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles(theme), [theme]);

  return (
    <View style={style.container}>
      <Text style={style.title}>Whoops!</Text>
      <Text style={style.message}>{error.message}</Text>
      <TouchableOpacity onPress={resetErrorBoundary} style={style.button}>
        <Text style={style.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}
