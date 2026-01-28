import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
	StyleSheet.create({
		container: {
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: theme.spacing.medium,
			paddingVertical: theme.spacing.small,
			gap: theme.spacing.small,
		},
		input: {
			flex: 1,
			paddingHorizontal: theme.spacing.small,
			paddingVertical: theme.spacing.tiny,
			borderRadius: theme.borderRadius.medium,
			backgroundColor: theme.colors.backgroundAlt,
			color: theme.colors.text,
			fontSize: theme.fonts.sizes.medium,
		},
	});
