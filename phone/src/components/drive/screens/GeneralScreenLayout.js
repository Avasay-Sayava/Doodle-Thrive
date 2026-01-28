import { useTheme } from "@/src/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { styles } from "@/styles/components/drive/screens/GeneralScreenLayout.styles";
import { useMemo } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import ThemedText from "@/src/components/common/ThemedText";

export default function GeneralScreenLayout({ children }) {
    const router = useRouter();
    const { theme } = useTheme();
    const style = useMemo(() => styles({ theme }), [theme]);

    const goBack = () => {
        router.replace("(drive)/(tabs)");
    }

    return (
        <View style={style.container}>
            <View style={style.header}>
                <TouchableOpacity onPress={goBack}>
                    <ThemedText style={style.backButton}>Back</ThemedText>
                </TouchableOpacity>
            </View>
            <View style={style.content}>
                {children}
            </View>
        </View>
    );
}