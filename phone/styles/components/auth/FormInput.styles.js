import { StyleSheet } from "react-native";

export const styles = (theme) =>
  new StyleSheet.create({
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.textMuted,
      padding: theme.spacing.small,
      borderRadius: theme.borderRadius.small,
      fontSize: theme.fonts.sizes.medium,
      marginBottom: theme.spacing.medium,
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
      marginBottom: theme.spacing.small,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    imagePreview: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    placeholderContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.large,
    },
    placeholderText: {
      color: theme.colors.textMuted,
    },
  });
