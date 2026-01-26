import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    row: {
      backgroundColor: theme.colors.border,
      borderRadius: theme.borderRadius.medium,
      alignContent: "center",
      justifyContent: "flex-start",
      flexDirection: "row",
      padding: theme.spacing.small,
      gap: theme.spacing.small,
    },
    iconBackdrop: {
      alignSelf: "center",
      width: theme.spacing.xlarge,
      height: theme.spacing.xlarge,
      borderRadius: theme.borderRadius.large,
      backgroundColor: theme.colors.background,
      alignContent: "center",
      justifyContent: "center",
      fontSize: theme.fonts.sizes.medium,
      color: theme.colors.text,
    },
    info: {
      flexDirection: "column",
    },
    name: {
      fontSize: theme.fonts.sizes.medium,
      fontWeight: theme.fonts.weights.bold,
      color: theme.colors.text,
    },
    secondary: {
      fontSize: theme.fonts.sizes.small,
      color: theme.colors.textSecondary,
      flexDirection: "row",
      gap: theme.spacing.small,
      alignItems: "center",
    },
    actionsMenuContainer: {
      position: "absolute",
      right: theme.spacing.small,
      top: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
  });
