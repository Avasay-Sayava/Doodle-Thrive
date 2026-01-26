import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.small,
    },
  });
