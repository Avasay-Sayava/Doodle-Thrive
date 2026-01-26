import { useMemo } from "react";
import { useTheme } from "@/src/contexts/ThemeContext";
import { View } from "react-native";
import { styles } from "@/styles/components/drive/tabs/TabHeader.styles";
import ChooseViewMode from "@/src/components/drive/tabs/ChooseViewMode";
import SortButton from "./SortButton";

export default function TabHeader({
  sortBy,
  setSortBy,
  isSortEnabled,
  viewMode,
  setViewMode,
}) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  return (
    <View style={[style.headerContainer]}>
      <SortButton
        sortBy={sortBy}
        setSortBy={setSortBy}
        isEnabled={isSortEnabled}
      />
      <ChooseViewMode viewMode={viewMode} setViewMode={setViewMode} />
    </View>
  );
}
