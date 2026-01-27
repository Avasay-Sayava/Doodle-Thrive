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
    sheetTitle: {
      flexDirection: "row",
      gap: theme.spacing.small,
      alignItems: "center",
      fontSize: theme.fonts.sizes.large,
      marginBottom: theme.spacing.medium,
      color: theme.colors.text,
      marginLeft: theme.spacing.small,
    },
    sheetTitleText: {
      fontSize: theme.fonts.sizes.large,
      fontWeight: theme.fonts.weights.bold,
      color: theme.colors.text,
    },
    optionItem: {
      animBackgroundColor: theme.colors.text + "22",
      durationIn: 50,
      durationOut: 150,
      paddingVertical: theme.spacing.medium,
      paddingHorizontal: theme.spacing.small,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.medium,
    },
    optionText: {
      fontSize: theme.fonts.sizes.medium,
      color: theme.colors.text,
    },
  });
