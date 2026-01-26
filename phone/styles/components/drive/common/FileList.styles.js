import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    container: {
      flexDirection: "column",
      gap: theme.spacing.small,
      flex: 1,
      padding: theme.spacing.small,
    },
    fill: {
      flex: 1,
    },
  });
