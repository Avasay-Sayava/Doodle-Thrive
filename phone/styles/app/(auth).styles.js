import { StyleSheet } from "react-native";

export const styles = (theme) =>
  new StyleSheet.create({
    title: {
      fontWeight: "bold",
      fontSize: theme.fonts.sizes.large,
      marginLeft: theme.spacing.small,
      marginBottom: theme.spacing.small,
    },
    form: {
      padding: theme.spacing.large,
      flex: 1,
      gap: theme.spacing.small,
      justifyContent: "center",
    },
    link: {
      color: theme.colors.primary,
      textAlign: "center",
    },
  });
