import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: theme.colors.border,
      borderRadius: theme.borderRadius.large,
      position: "relative",
    },
    slider: {
      position: "absolute",
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.medium,
    },
    iconsContainer: {
      flexDirection: "row",
      flex: 1,
      zIndex: 1,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
