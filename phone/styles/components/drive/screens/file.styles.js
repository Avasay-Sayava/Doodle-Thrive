import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: theme.spacing.medium,
      gap: theme.spacing.small,
    },
    header: {
      gap: theme.spacing.small,
    },
    title: {
      fontSize: theme.fonts.sizes.large,
      fontWeight: theme.fonts.weights.bold,
      color: theme.colors.text,
    },
    editButton: {
      alignSelf: "flex-start",
      paddingVertical: theme.spacing.small,
      paddingHorizontal: theme.spacing.medium,
      borderRadius: theme.borderRadius.small,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.primary + "10",
    },
    editButtonText: {
      fontSize: theme.fonts.sizes.medium,
      fontWeight: theme.fonts.weights.medium,
      color: theme.colors.text,
    },
    bodyText: {
      fontSize: theme.fonts.sizes.medium,
      color: theme.colors.text,
      lineHeight: theme.fonts.sizes.medium * 1.4,
    },
    image: {
      width: "100%",
      height: 320,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.backgroundAlt,
      resizeMode: "contain",
    },
    stateContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      padding: theme.spacing.medium,
    },
    stateText: {
      fontSize: theme.fonts.sizes.medium,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });
