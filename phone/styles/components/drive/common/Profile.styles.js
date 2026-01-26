import { StyleSheet } from "react-native";

export const styles = ({ theme, size }) =>
  new StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: theme.borderRadius.large,
      backgroundColor: theme.colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    text: {
      color: theme.colors.primary,
      fontSize: size * 0.5,
      fontWeight: theme.fonts.weights.bold,
    },
  });
