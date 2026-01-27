import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    triggerButton: {
      width: theme.spacing.xlarge,
      height: theme.spacing.xlarge,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.borderRadius.max,
    },
    sheetTitle: {
      flexDirection: "row",
      gap: theme.spacing.small,
      alignItems: "center",
      fontSize: theme.fonts.sizes.large,
      marginBottom: theme.spacing.medium,
      color: theme.colors.text,
      marginLeft: theme.spacing.small,
    },
    sheetTitleText: {
      fontSize: theme.fonts.sizes.large,
      fontWeight: theme.fonts.weights.bold,
      color: theme.colors.text,
    },
    optionItem: {
      animBackgroundColor: theme.colors.text + "22",
      durationIn: 50,
      durationOut: 150,
      paddingVertical: theme.spacing.medium,
      paddingHorizontal: theme.spacing.small,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.medium,
    },
    optionText: {
      fontSize: theme.fonts.sizes.medium,
      color: theme.colors.text,
    },
  });
