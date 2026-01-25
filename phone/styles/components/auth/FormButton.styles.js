import { StyleSheet } from 'react-native';

export const styles = (theme) =>
  new StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        backgroundColor: theme.colors.primaryAlt,
        padding: theme.spacing.small,
        borderRadius: theme.borderRadius.small,
    },
    buttonError: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: theme.borderRadius.small,
        borderTopRightRadius: theme.borderRadius.small,
    },
    buttonText: {
        color: theme.colors.onPrimary,
        fontSize: theme.fonts.medium,
        fontWeight: 'bold',
    },
  });