import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    listContainer: {
      flexDirection: "column",
      gap: theme.spacing.small,
      flex: 1,
      padding: theme.spacing.small,
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.small,
      padding: theme.spacing.small,
      justifyContent: "flex-start",
    },
  });
