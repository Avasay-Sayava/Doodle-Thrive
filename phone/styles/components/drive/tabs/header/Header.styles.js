import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.border,
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      flexDirection: "row",
      gap: theme.spacing.small,
      paddingHorizontal: theme.spacing.medium,
      paddingVertical: theme.spacing.small,
    },
  });
