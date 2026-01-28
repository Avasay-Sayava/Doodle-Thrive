import { StyleSheet } from "react-native";

export const styles = ({ theme }) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
			paddingHorizontal: theme.spacing.medium,
			paddingVertical: theme.spacing.medium,
		},
		title: {
			fontSize: theme.fonts.sizes.large,
			color: theme.colors.text,
			marginBottom: theme.spacing.medium,
			fontWeight: theme.fonts.weights.bold,
		},
		subtitle: {
			fontSize: theme.fonts.sizes.medium,
			color: theme.colors.textSecondary,
			marginTop: theme.spacing.large,
			marginBottom: theme.spacing.small,
		},
		switchRow: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			marginTop: theme.spacing.small,
		},
		switchLabel: {
			fontSize: theme.fonts.sizes.medium,
			color: theme.colors.text,
		},
		switchContainer: {
			paddingHorizontal: theme.spacing.tiny,
			paddingVertical: theme.spacing.tiny,
		},
		switchTrack: {
			width: theme.spacing.large * 2,
			height: theme.spacing.medium,
			borderRadius: theme.borderRadius.max,
			backgroundColor: theme.colors.backgroundAlt,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "flex-start",
			paddingHorizontal: theme.spacing.tiny,
		},
		switchTrackActive: {
			backgroundColor: theme.colors.primary,
			justifyContent: "flex-end",
		},
		switchThumb: {
			width: theme.spacing.medium,
			height: theme.spacing.medium,
			borderRadius: theme.borderRadius.max,
			backgroundColor: theme.colors.card,
		},
		switchThumbActive: {
			backgroundColor: theme.colors.background,
		},
		privacyButton: {
			marginTop: theme.spacing.medium,
			paddingVertical: theme.spacing.small,
			paddingHorizontal: theme.spacing.medium,
			borderRadius: theme.borderRadius.small,
			borderWidth: 1,
			borderColor: theme.colors.border,
			backgroundColor: "transparent",
		},
		privacyButtonText: {
			fontSize: theme.fonts.sizes.medium,
			color: theme.colors.text,
			fontWeight: theme.fonts.weights.medium,
		},
		privacyButtonNote: {
			marginTop: theme.spacing.tiny,
			fontSize: theme.fonts.sizes.small,
			color: theme.colors.textSecondary,
		},
		privacyMessage: {
			marginTop: theme.spacing.small,
			fontSize: theme.fonts.sizes.small,
			color: theme.colors.textSecondary,
		},
	});

