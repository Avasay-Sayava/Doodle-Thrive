import React, { useMemo } from "react";
import { styles } from "@/styles/components/auth/FormButton.styles";
import { useTheme } from "@/src/contexts/ThemeContext";
import ErrorLabel from "@/src/components/common/ErrorLabel";
import { TouchableOpacity, Text } from "react-native";

export default function FormButton({
  title,
  onPress,
  error = false,
  errorMessage = "",
}) {
  const { theme } = useTheme();
  const style = useMemo(() => styles(theme), [theme]);

  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={[style.buttonContainer, error && style.buttonError]}
      >
        <Text style={style.buttonText}>{title}</Text>
      </TouchableOpacity>
      <ErrorLabel visible={error} text={errorMessage} />
    </>
  );
}
