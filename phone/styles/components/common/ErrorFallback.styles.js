import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.large,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: theme.fonts.sizes.xlarge,
      fontWeight: theme.fonts.weights.bold,
      marginBottom: theme.spacing.medium,
      color: theme.colors.text,
    },
    message: {
      textAlign: "center",
      marginBottom: theme.spacing.large,
      color: theme.colors.textMuted,
      fontSize: theme.fonts.sizes.medium,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.medium,
      paddingHorizontal: theme.spacing.large,
      borderRadius: theme.borderRadius.medium,
    },
    buttonText: {
      color: theme.colors.background,
      fontWeight: theme.fonts.weights.bold,
      fontSize: theme.fonts.sizes.medium,
    },
  });
