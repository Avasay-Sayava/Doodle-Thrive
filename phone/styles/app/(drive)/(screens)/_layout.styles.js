import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    title: {
      marginTop: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
      fontSize: theme.fonts.sizes.large,
      color: theme.colors.text,
      fontWeight: theme.fonts.weights.bold,
    },
    header: {
      justifyContent: "center",
      padding: theme.spacing.small,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      color: theme.colors.primary,
      fontSize: theme.fonts.sizes.xxlarge,
      alignSelf: "flex-start",
      transform: [{ rotate: "-90deg" }],
    },
    content: {
      flex: 1,
    },
  });
