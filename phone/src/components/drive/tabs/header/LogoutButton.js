import Icon from "@/src/components/common/Icon";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { styles } from "@/styles/components/drive/tabs/header/LogoutButton.styles";
import { useAuth } from "@/src/contexts/AuthContext";

export default function LogoutButton() {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const { signout } = useAuth();

  return (
    <AnimatedPressable
      style={style.button}
      onPress={signout}
      durationIn={style.button.durationIn}
      durationOut={style.button.durationOut}
      backgroundColor={style.button.animBackgroundColor}
    >
      <Icon
        name="logout"
        size={style.button.fontSize}
        color={style.button.color}
      />
    </AnimatedPressable>
  );
}
