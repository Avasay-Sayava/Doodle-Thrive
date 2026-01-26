import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    common: {
      margin: theme.spacing.tiny,
      padding: theme.spacing.small,
      flexDirection: "row",
      justifyContent: "center",
    },
    gridActive: {
      borderRadius: theme.borderRadius.xlarge,
      backgroundColor: theme.colors.primary,
    },
    gridInactive: {
      borderBottomLeftRadius: theme.borderRadius.large,
      borderBottomRightRadius: theme.borderRadius.small,
      borderTopLeftRadius: theme.borderRadius.large,
      borderTopRightRadius: theme.borderRadius.small,
      backgroundColor: theme.colors.backgroundSecondary,
    },
    listActive: {
      borderRadius: theme.borderRadius.xlarge,
      backgroundColor: theme.colors.primary,
    },
    listInactive: {
      borderBottomRightRadius: theme.borderRadius.large,
      borderTopRightRadius: theme.borderRadius.large,
      borderBottomLeftRadius: theme.borderRadius.small,
      borderTopLeftRadius: theme.borderRadius.small,
      backgroundColor: theme.colors.backgroundSecondary,
    },
  });