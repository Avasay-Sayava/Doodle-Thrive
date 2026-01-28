import { StyleSheet } from "react-native";

export const styles = ({ theme, insets }) =>
  new StyleSheet.create({
    wrapper: {
      position: "absolute",
      right: theme.spacing.large,
      bottom: 40 + theme.spacing.large + (insets?.bottom || 0),
      zIndex: 10,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.large,
    },
    plus: {
      color: theme.colors.background,
      fontSize: theme.fonts.sizes.xxlarge,
      lineHeight: theme.fonts.sizes.xxlarge,
    },
  });
