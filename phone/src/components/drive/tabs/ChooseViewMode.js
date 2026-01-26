import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles } from "@/styles/components/drive/tabs/ChooseViewMode.styles";
import { useState } from "react";
import { View } from "react-native";
import { useEffect, useMemo } from "react";
import Icon from "@/src/components/common/Icon.js";

const SIZE = 24;
export default function ChooseViewMode({ viewMode, setViewMode }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);
  const [gridStyle, setGridStyle] = useState(style.gridInactive);
  const [listStyle, setListStyle] = useState(style.listInactive);

  useEffect(() => {
    if (viewMode == "list") {
      setGridStyle({
        style: style.gridInactive,
        color: theme.colors.textSecondary,
      });
      setListStyle({
        style: style.listActive,
        color: theme.colors.textInverted,
      });
    } else {
      setGridStyle({
        style: style.gridActive,
        color: theme.colors.textInverted,
      });
      setListStyle({
        style: style.listInactive,
        color: theme.colors.textSecondary,
      });
    }
  }, [viewMode, style]);

  return (
    <TouchableOpacity
      style={style.container}
      onPress={() => {
        setViewMode(viewMode == "list" ? "grid" : "list");
      }}
    >
      <View style={[style.common, listStyle?.style]}>
        <Icon
          name="list"
          size={SIZE}
          color={listStyle?.color || theme.colors.textSecondary}
        />
      </View>
      <View style={[style.common, gridStyle?.style]}>
        <Icon
          name="grid"
          size={SIZE}
          color={gridStyle?.color || theme.colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
}
