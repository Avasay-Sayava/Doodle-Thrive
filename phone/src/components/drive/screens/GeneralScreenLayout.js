import { useTheme } from "@/src/contexts/ThemeContext";
import { useRouter } from "expo-router";
import styles from "@/styles/components/drive/screens/generalScreenLayout.styles";

export default function GeneralScreenLayout({ children }) {
    const router = useRouter();
    const { style } = useTheme();


    const goBack = () => {
        router.replace("(drive)/(tabs)");
    }

    return (
        <></>
    );
}