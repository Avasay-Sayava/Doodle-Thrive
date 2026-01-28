import Icon from "@/src/components/common/Icon";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { styles } from "@/styles/components/drive/tabs/header/AskDemini.styles";
import { useRouter } from "expo-router";

export default function AskDemini() {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const router = useRouter();

  return (
    <AnimatedPressable
      style={style.button}
      onPress={() => {
        router.push("/(drive)/(screens)/rickroll");
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
