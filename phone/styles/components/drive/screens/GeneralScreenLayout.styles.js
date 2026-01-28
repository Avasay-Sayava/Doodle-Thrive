import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            height: "10%",
            justifyContent: "center",
            paddingLeft: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        backButton: {
            color: theme.colors.primary,
            fontSize: 18,
            fontWeight: "bold",
        },
        content: {
            flex: 1,
            padding: 20,
        },
    });
