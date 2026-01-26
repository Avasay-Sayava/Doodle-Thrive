import Icon from "@/src/components/common/Icon";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { styles } from "@/styles/components/drive/tabs/header/SearchButton.styles";
import { Text } from "react-native";

export default function SearchButton() {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  return (
    <AnimatedPressable
      style={style.button}
      onPress={() => {
        // TODO: DO THIS
      }}
      durationIn={style.button.durationIn}
      durationOut={style.button.durationOut}
      backgroundColor={style.button.animBackgroundColor}
    >
      <Icon
        name="search"
        size={style.button.fontSize}
        color={style.button.color}
      />
      <Text style={style.text}>Search in Drive...</Text>
    </AnimatedPressable>
  );
}
