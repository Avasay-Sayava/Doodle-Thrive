import Icon from "@/src/components/common/Icon";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { styles } from "@/styles/components/drive/tabs/header/AskDemini.styles";

export default function AskDemini() {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  return (
    <AnimatedPressable
      style={style.button}
      onPress={() => {
        // TODO: Replace alerts with an actual rickroll
      }}
      durationIn={style.button.durationIn}
      durationOut={style.button.durationOut}
      backgroundColor={style.button.animBackgroundColor}
    >
      <Icon
        name="demini"
        size={style.button.fontSize}
        color={style.button.color}
      />
    </AnimatedPressable>
  );
}
