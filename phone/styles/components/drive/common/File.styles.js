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
      flex: 1,
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
    gridCard: {
      backgroundColor: theme.colors.border,
      borderRadius: theme.borderRadius.large,
      padding: theme.spacing.medium,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    gridIconContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    gridName: {
      position: "absolute",
      bottom: theme.spacing.medium,
      fontSize: theme.fonts.sizes.medium,
      fontWeight: theme.fonts.weights.medium,
      color: theme.colors.text,
      textAlign: "center",
      width: "100%",
    },
    gridActions: {
      position: "absolute",
      top: theme.spacing.small,
      right: theme.spacing.small,
      zIndex: 1,
    },
    listActions: {
      alignSelf: "center",
      justifyContent: "center",
    },
    gridIconsContainer: {
      position: "absolute",
      flexDirection: "row",
      gap: theme.spacing.small,
      top: theme.spacing.medium,
      left: theme.spacing.medium,
      zIndex: 1,
    },
  });
