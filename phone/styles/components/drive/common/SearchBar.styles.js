import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.medium,
      paddingTop: theme.spacing.medium,
      paddingBottom: theme.spacing.small,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.border,
      borderRadius: theme.borderRadius.max,
      paddingHorizontal: theme.spacing.medium,
      height: 40,
      gap: theme.spacing.small,
    },
    input: {
      flex: 1,
      fontSize: theme.fonts.sizes.medium,
      color: theme.colors.text,
      height: "100%",
      paddingVertical: 0,
    },
    icon: {
      fontSize: theme.fonts.sizes.medium,
      color: theme.colors.textSecondary,
    },
  });
