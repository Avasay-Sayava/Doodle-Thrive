import { StyleSheet } from "react-native";

export const styles = (theme) =>
  new StyleSheet.create({
    title: {
      fontWeight: "bold",
      fontSize: theme.fonts.sizes.large,
      marginBottom: theme.spacing.medium,
    },
    form: {
      padding: theme.spacing.large,
    },
  });
