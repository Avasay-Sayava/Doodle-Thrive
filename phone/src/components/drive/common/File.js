import { styles } from "@/styles/components/drive/common/File.styles";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { Pressable, View } from "react-native";
import {useAuth} from "@/src/contexts/AuthContext";
import Icon from "@/src/components/common/Icon";
import RelativeDate from "@/src/components/drive/common/RelativeDate";

export default function File({ file }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);
  const { uuid } = useAuth();

  return (
    <View style={style.row}>
      <View style={style.iconBackdrop}>
        <Icon name={file.type} size={theme.fonts.sizes.large} color={theme.colors.text} />
      </View>
      <View style={style.info}>
        <View style={style.name}>{file.name}</View>
        <View style={style.secondary}>
          {file.starred ? <Icon name="star" size={theme.fonts.sizes.small} color={theme.colors.text} /> : <></>}
          {file.owner === uuid ? <></> : <Icon name="shared" size={theme.fonts.sizes.small} color={theme.colors.text} />}
          <b>:</b>
          <RelativeDate timestamp={file.modified} />
        </View>
      </View>
      <Pressable style={style.actionsMenu}>
        <Icon name="vertical-dots" size={theme.fonts.sizes.large} color={theme.colors.text} />
      </Pressable>
    </View>
  );
}
