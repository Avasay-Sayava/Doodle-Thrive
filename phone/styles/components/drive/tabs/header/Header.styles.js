import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    container: {
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      flexDirection: "row",
      gap: theme.spacing.small,
      padding: theme.spacing.medium,
      marginBottom: theme.spacing.small,
    },
  });
