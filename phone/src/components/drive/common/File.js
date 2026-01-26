import { styles } from "@/styles/components/drive/common/File.styles";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useEffect, useMemo } from "react";
import { View, Text } from "react-native";
import { useAuth } from "@/src/contexts/AuthContext";
import Icon from "@/src/components/common/Icon";
import RelativeDate from "@/src/components/drive/common/RelativeDate";
import ActionsMenu from "@/src/components/drive/common/ActionsMenu";
import LoadingScreen from "@/src/components/common/LoadingScreen";
import { useUser } from "@/src/hooks/api/users/useUser";

export default function File({ file }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);
  const { uuid } = useAuth();
  const { user, loading, error } = useUser(file.owner);

  useEffect(() => {}, [user, loading, error]);

  if (loading)
    return (
      <>
        <View style={style.row}>
          <LoadingScreen />
        </View>
      </>
    );

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
          <Text style={style.secondary}>{user.username}</Text>
          <Text
            style={[style.secondary, { fontWeight: theme.fonts.weights.bold }]}
          >
            •
          </Text>
          <Text style={style.secondary}>
            <RelativeDate timestamp={file.modified} />
          </Text>
        </View>
      </View>

      <View style={style.actionsMenuContainer}>
        <ActionsMenu file={file} />
      </View>
    </View>
  );
}
