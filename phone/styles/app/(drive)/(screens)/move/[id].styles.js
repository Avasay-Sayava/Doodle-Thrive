import { StyleSheet } from "react-native";

export const styles = ({ theme, insets }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    listContainer: {
      flex: 1,
    },
    emptyContainer: {
      padding: 40,
      alignItems: "center",
    },
    emptyText: {
      color: theme.colors.textMuted,
      fontSize: 16,
      textAlign: "center",
    },
    footer: {
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingBottom: insets.bottom,
    },
    footerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
      alignItems: "center",
    },
    cancelButton: {
      padding: 12,
    },
    cancelText: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "500",
    },
    moveButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
    },
    moveText: {
      color: theme.colors.background,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
