import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    button: {
      fontSize: theme.fonts.sizes.xlarge,
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.max,
      alignItems: "center",
      justifyContent: "center",
      animBackgroundColor: theme.colors.text + "22",
      color: theme.colors.text,
      durationIn: 50,
      durationOut: 150,
    },
  });
