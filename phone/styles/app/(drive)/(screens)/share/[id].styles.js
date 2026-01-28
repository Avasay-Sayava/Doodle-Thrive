import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    inputContainer: {
      flexDirection: "row",
      gap: 10,
    },
    input: {
      flex: 1,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 8,
      padding: 12,
      color: theme.colors.text,
      fontSize: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    addButton: {
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    addButtonText: {
      color: theme.colors.background,
      fontWeight: "600",
      fontSize: 16,
    },
    listContainer: {
      flex: 1,
    },
    userItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + "40",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    avatarText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    userInfo: {
      flex: 1,
    },
    username: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
    },
    roleText: {
      fontSize: 14,
      color: theme.colors.textMuted,
      marginTop: 2,
      textTransform: "capitalize",
    },
    emptyText: {
      textAlign: "center",
      color: theme.colors.textMuted,
      marginTop: 40,
      fontSize: 16,
    },
    loadingContainer: {
      marginTop: 40,
    },
  });
