import { useMemo } from "react";
import { useTheme } from "@/src/contexts/ThemeContext";
import { View } from "react-native";
import { styles } from "@/styles/components/drive/tabs/TabHeader.styles";
import ChooseFileView from "@/src/components/drive/tabs/ChooseFileView";
import SortButton from "./SortButton";

export default function TabHeader({
    sortBy,
    setSortBy,
    isSortEnabled,
    fileView,
    setFileView,
}) {
    const { theme } = useTheme();
    const style = useMemo(() => styles(theme), [theme]);

    return (
        <View style={[style.headerContainer]}>
            <SortButton sortBy={sortBy} setSortBy={setSortBy} isEnabled={isSortEnabled} />
            <ChooseFileView fileView={fileView} setFileView={setFileView} />
        </View>
    );
}