import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.text + "22",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.large,
    },
    container: {
      width: "100%",
      maxWidth: 400,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.large,
      padding: theme.spacing.large,
      gap: theme.spacing.medium,
    },
    title: {
      fontSize: theme.fonts.sizes.large,
      fontWeight: theme.fonts.weights.bold,
      color: theme.colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.medium,
      fontSize: theme.fonts.sizes.medium,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: theme.spacing.small,
      marginTop: theme.spacing.small,
    },
    button: {
      paddingVertical: theme.spacing.small,
      paddingHorizontal: theme.spacing.medium,
      borderRadius: theme.borderRadius.medium,
      minWidth: 80,
      alignItems: "center",
      justifyContent: "center",
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      fontWeight: theme.fonts.weights.bold,
      fontSize: theme.fonts.sizes.medium,
    },
  });
