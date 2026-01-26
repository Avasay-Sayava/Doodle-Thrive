import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    row: {
      backgroundColor: theme.colors.border,
      borderRadius: theme.borderRadius.small,
      alignContent: "center",
      justifyContent: "flex-start",
      flexDirection: "row",
      padding: theme.spacing.small,
      gap: theme.spacing.small,
    },
    iconBackdrop: {
      width: theme.spacing.xlarge,
      height: theme.spacing.xlarge,
      borderRadius: theme.borderRadius.large,
      backgroundColor: theme.colors.background,
      alignContent: "center",
      justifyContent: "center",
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
      color: theme.colors.textMuted,
      flexDirection: "row",
      gap: theme.spacing.small
    },
    actionsMenu: ({pressed}) => ({
      width: theme.spacing.xlarge,
      height: theme.spacing.xlarge,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.borderRadius.max,
      color: theme.colors.text,
      backgroundColor: pressed ? theme.colors.primary : "transparent",
      position: "absolute",
      marginRight: theme.spacing.small,
      right: 0
    })
  });
