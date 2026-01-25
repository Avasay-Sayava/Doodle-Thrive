import { StyleSheet } from "react-native";

export const styles = (theme) =>
  new StyleSheet.create({
    container: {
      zIndex: -1,
      backgroundColor: theme.colors.primaryLight,
      padding: theme.spacing.small,
      marginBottom: theme.spacing.medium,
      borderLeftColor: theme.colors.error,
      borderLeftWidth: theme.spacing.small,
      /* set border radius to 0 on top and small on bottom */
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: theme.spacing.small,
      borderBottomRightRadius: theme.spacing.small,
    },
    text: {
      color: theme.colors.error,
      fontSize: theme.fonts.sizes.small,
    },
  });
