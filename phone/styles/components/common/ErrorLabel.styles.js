import { StyleSheet } from "react-native";

export const styles = (theme) =>
  new StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primaryLight,
      padding: theme.spacing.small,
      borderRadius: theme.borderRadius.small,
      borderLeftColor: theme.colors.error,
      borderLeftWidth: theme.spacing.small,
    },
    text: {
      color: theme.colors.error,
      fontSize: theme.fonts.sizes.small,
    },
  });
