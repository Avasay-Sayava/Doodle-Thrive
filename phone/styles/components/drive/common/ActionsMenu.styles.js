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
  });
