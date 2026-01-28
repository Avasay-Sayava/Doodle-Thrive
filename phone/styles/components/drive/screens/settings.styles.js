import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.medium,
      paddingVertical: theme.spacing.medium,
    },
    title: {
      fontSize: theme.fonts.sizes.large,
      color: theme.colors.text,
      fontWeight: theme.fonts.weights.bold,
    },
    subtitle: {
      fontSize: theme.fonts.sizes.medium,
      fontWeight: theme.fonts.weights.medium,
      color: theme.colors.textSecondary,
      margin: theme.spacing.small,
      marginTop: theme.spacing.medium,
    },
    button: {
      paddingVertical: theme.spacing.small,
      paddingHorizontal: theme.spacing.medium,
      borderRadius: theme.borderRadius.small,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: "transparent",
    },
    buttonText: {
      fontSize: theme.fonts.sizes.medium,
      color: theme.colors.text,
      fontWeight: theme.fonts.weights.medium,
    },
    buttonNote: {
      marginTop: theme.spacing.tiny,
      fontSize: theme.fonts.sizes.small,
      color: theme.colors.textSecondary,
    },
  });
