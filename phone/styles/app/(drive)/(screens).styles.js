import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    header: {
      justifyContent: "center",
      paddingHorizontal: theme.spacing.large,
      paddingVertical: theme.spacing.small,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: theme.spacing.small,
    },
    backButton: {
      color: theme.colors.primary,
      fontSize: theme.fonts.sizes.xlarge,
      fontWeight: "bold",
    },
    content: {
      flex: 1,
    },
  });
