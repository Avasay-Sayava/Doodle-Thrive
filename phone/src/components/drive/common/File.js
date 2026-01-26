import { styles } from "@/styles/components/drive/common/File.styles";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { Pressable, View, Text } from "react-native";
import { useAuth } from "@/src/contexts/AuthContext";
import Icon from "@/src/components/common/Icon";
import RelativeDate from "@/src/components/drive/common/RelativeDate";

export default function File({ file }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);
  const { uuid } = useAuth();

  return (
    <View style={style.row}>
      <View style={style.iconBackdrop}>
        <Icon
          name={file.type}
          size={style.iconBackdrop.fontSize}
          color={style.iconBackdrop.color}
        />
      </View>
      <View style={style.info}>
        <Text style={style.name}>{file.name}</Text>
        <View style={style.secondary}>
          {file.starred ? (
            <Icon
              name="star"
              size={style.secondary.fontSize}
              color={style.secondary.color}
            />
          ) : (
            <></>
          )}
          {file.owner !== uuid ? (
            <Icon
              name="shared"
              size={style.secondary.fontSize}
              color={style.secondary.color}
            />
          ) : (
            <></>
          )}
          <Text style={style.secondary}>
            <b>•</b>
          </Text>
          <Text style={style.secondary}>
            <RelativeDate timestamp={file.modified} />
          </Text>
        </View>
      </View>
      <Pressable style={style.actionsMenu}>
        <Icon
          name="vertical-dots"
          size={theme.fonts.sizes.large}
          color={theme.colors.text}
        />
      </Pressable>
    </View>
  );
}
