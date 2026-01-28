import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "@/styles/components/drive/screens/settings.styles";
import GeneralScreenLayout from "@/src/components/drive/screens/GeneralScreenLayout";
import ThemedText from "@/src/components/common/ThemedText";

export default function Settings() {
    const { theme, change } = useTheme();
    const [privacyMessage, setPrivacyMessage] = useState("");

    const style = useMemo(() => styles({ theme }), [theme]);

    const handleToggleTheme = () => {
        const nextTheme = theme.dark ? "pink" : "soviet";
        change(nextTheme);
    };

    return (
        <GeneralScreenLayout>
            <View style={style.container}>
                <ThemedText style={style.title}>Settings</ThemedText>
                <ThemedText style={style.subtitle}>Visuals</ThemedText>
                <View style={style.switchRow}>
                    <Text style={style.switchLabel}>Dark mode</Text>
                    <TouchableOpacity
                        style={style.switchContainer}
                        activeOpacity={0.7}
                        onPress={handleToggleTheme}
                    >
                        <View
                            style={[
                                style.switchTrack,
                                theme.dark && style.switchTrackActive,
                            ]}
                        >
                            <View
                                style={[
                                    style.switchThumb,
                                    theme.dark && style.switchThumbActive,
                                ]}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <ThemedText style={style.subtitle}>Privacy</ThemedText>
                <TouchableOpacity
                    style={style.privacyButton}
                    activeOpacity={0.7}
                    onPress={() => setPrivacyMessage("already sold to china")}
                >
                    <ThemedText style={style.privacyButtonText}>Enable privacy mode</ThemedText>
                    <ThemedText style={style.privacyButtonNote}>Disabled</ThemedText>
                </TouchableOpacity>
                {privacyMessage ? (
                    <ThemedText style={style.privacyMessage}>{privacyMessage}</ThemedText>
                ) : null}
            </View>
        </GeneralScreenLayout>
    );
}