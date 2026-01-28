import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      justifyContent: "center",
      padding: theme.spacing.small,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: theme.spacing.small,
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
