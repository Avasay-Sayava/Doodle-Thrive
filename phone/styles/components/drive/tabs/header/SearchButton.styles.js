import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    button: {
      fontSize: theme.fonts.sizes.medium,
      flex: 1,
      height: 40,
      paddingHorizontal: theme.spacing.medium,
      gap: theme.spacing.small,
      borderRadius: theme.borderRadius.max,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: theme.colors.border,
      animBackgroundColor: theme.colors.text + "22",
      color: theme.colors.textSecondary,
      durationIn: 50,
      durationOut: 150,
    },
    text: {
      color: theme.colors.textSecondary,
      fontWeight: theme.fonts.weights.medium,
    },
  });
