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
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.text + "22",
    },
    modalContent: {
      alignSelf: "center",
      maxWidth: 700,
      backgroundColor: theme.colors.card,
      padding: theme.spacing.medium,
      paddingTop: 0,
      borderTopLeftRadius: theme.borderRadius.large,
      borderTopRightRadius: theme.borderRadius.large,
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
    dragHandle: {
      width: 40,
      height: theme.spacing.small,
      backgroundColor: theme.colors.border,
      borderRadius: theme.borderRadius.max,
      alignSelf: "center",
    },
    handleContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.medium,
      borderTopLeftRadius: theme.borderRadius.large,
      borderTopRightRadius: theme.borderRadius.large,
    },
  });
