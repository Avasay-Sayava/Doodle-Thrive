import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { View } from "react-native-web";
import styles from "@/styles/components/drive/pages/settings.styles";
import { Text } from "react-native";

export default function Settings() {
    const { theme } = useTheme();
    const style = useMemo(() => theme(styles), [theme]);
    
    return (
        <View style={style.container}>
            <Text style={style.title}>Settings Page</Text>
            <Text style={style.subtitle}>Visuals</Text>
            
        </View>
    );
}