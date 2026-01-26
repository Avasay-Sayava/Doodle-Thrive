import { useMemo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles } from "@/styles/components/common/ErrorLabel.styles";

export default function ErrorLabel({ text, visible }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  return (
    <>
      {visible ? (
        <View style={style.container}>
          <Text style={style.text}>{text}</Text>
        </View>
      ) : (
        <></>
      )}
    </>
  );
}
