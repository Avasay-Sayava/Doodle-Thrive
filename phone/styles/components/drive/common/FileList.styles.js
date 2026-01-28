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
    centerContainer: {
      flexGrow: 1,
      justifyContent: "center",
    },
    emptyText: {
      textAlign: "center",
      marginTop: theme.spacing.xlarge,
      color: theme.colors.textSecondary,
      fontSize: theme.fonts.sizes.medium,
      width: "100%",
    },
  });
