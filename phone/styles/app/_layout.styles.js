import { StyleSheet } from "react-native";

export const styles = (theme) => new StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fonts.sizes.medium,
    textAlign: "center",
    marginBottom: theme.spacing.large,
  },
  retryButton: {
    marginTop: theme.spacing.medium,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.fonts.sizes.medium,
    fontWeight: theme.fonts.weights.bold,
  },
});
