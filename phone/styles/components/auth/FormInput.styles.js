import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  new StyleSheet.create({
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.textMuted,
      padding: theme.spacing.small,
      borderRadius: theme.borderRadius.small,
      fontSize: theme.fonts.sizes.medium,
      color: theme.colors.text,
    },
    imageInput: {
      height: 128,
      width: "100%",
      borderWidth: 1,
      borderColor: theme.colors.textMuted,
      borderStyle: "dashed",
      borderRadius: theme.borderRadius.small,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
    inputError: {
      borderColor: theme.colors.error,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      marginBottom: 0,
    },
    imagePreview: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    placeholderContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    placeholderText: {
      color: theme.colors.textMuted,
    },
  });
