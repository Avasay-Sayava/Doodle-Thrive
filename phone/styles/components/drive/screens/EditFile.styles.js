import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.medium,
      paddingTop: theme.spacing.medium,
      paddingBottom: theme.spacing.small,
      gap: theme.spacing.small,
    },
    title: {
      fontSize: theme.fonts.sizes.large,
      fontWeight: theme.fonts.weights.bold,
      color: theme.colors.text,
    },
    saveButton: {
      alignSelf: "flex-start",
      paddingVertical: theme.spacing.small,
      paddingHorizontal: theme.spacing.medium,
      borderRadius: theme.borderRadius.small,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.primary + "10",
    },
    saveButtonText: {
      fontSize: theme.fonts.sizes.medium,
      fontWeight: theme.fonts.weights.medium,
      color: theme.colors.text,
    },
    editorContainer: {
      flex: 1,
    },
    editorContent: {
      paddingHorizontal: theme.spacing.medium,
      paddingBottom: theme.spacing.large,
    },
    input: {
      minHeight: 320,
      fontSize: theme.fonts.sizes.medium,
      color: theme.colors.text,
      lineHeight: theme.fonts.sizes.medium * 1.4,
    },
  });
