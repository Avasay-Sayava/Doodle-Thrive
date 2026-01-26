import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.small,
      borderRadius: theme.borderRadius.large,
      gap: theme.spacing.small,
    },
    text: {
      color: theme.colors.text,
      fontSize: theme.fonts.sizes.medium,
      fontWeight: theme.fonts.weights.bold,
    },
  });
