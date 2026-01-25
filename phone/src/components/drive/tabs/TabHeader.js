import { useContext } from "react";
import { useTheme } from "@/src/contexts/ThemeContext";
import { View } from "react-native";
import { styles } from "@/styles/components/drive/tabs/TabHeader.styles";
import ChooseFileView from "@/src/components/drive/tabs/ChooseFileView";
import { useMemo } from "react";
import SortButton from "./SortButton";

export default function TabHeader({ sortEnabled, setSortEnabled, fileView, setFileView }) {
    const { theme } = useTheme();
    const style = useMemo(() => styles(theme), [theme]);

    return (
        <View style={[style.headerContainer]}>
            <SortButton options={sortEnabled}></SortButton>
            <ChooseFileView fileView={fileView} setFileView={setFileView} />
        </View>
    );
}