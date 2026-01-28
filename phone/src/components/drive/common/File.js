import { styles } from "@/styles/components/drive/common/File.styles";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useEffect, useMemo } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/src/contexts/AuthContext";
import Icon from "@/src/components/common/Icon";
import getFileIconName from "@/src/utils/common/getFileIconName";
import RelativeDate from "@/src/components/drive/common/RelativeDate";
import ActionsMenu from "@/src/components/drive/common/ActionsMenu";
import LoadingScreen from "@/src/components/common/LoadingScreen";
import { useUser } from "@/src/hooks/api/users/useUser";
import { useOrientation } from "@/src/hooks/common/useOrientation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const baseGridWidth = 150;

export default function File({ file, viewMode }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const router = useRouter();

  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const orientation = useOrientation();

  useEffect(() => {}, [orientation]);

  const insets = useSafeAreaInsets();

  const safeScreenWidth = SCREEN_WIDTH - insets.left - insets.right;

  const gridCardBaseWidth = Math.min(baseGridWidth, safeScreenWidth / 2);
  const gridCards = Math.floor(safeScreenWidth / gridCardBaseWidth);
  const gridCardSize =
    (safeScreenWidth - theme.spacing.small) / gridCards - theme.spacing.small;

  const { uuid } = useAuth();
  const { user, loading, error } = useUser(file.owner);
  const fileIconName = useMemo(() => getFileIconName(file), [file]);

  useEffect(() => {}, [user, loading, error]);

  if (loading) {
    if (viewMode === "grid") {
      return (
        <View
          style={[
            {
              justifyContent: "center",
              width: gridCardSize,
              height: gridCardSize,
            },
            style.gridCard,
          ]}
        >
          <LoadingScreen />
        </View>
      );
    }
    return (
      <View style={style.row}>
        <LoadingScreen />
      </View>
    );
  }

  const handlePress = () => {
    if (file.type === "folder") {
      router.push({
        pathname: "(drive)/(screens)/folder/[id]",
        params: { id: file.id },
      });
      return;
    }

    if (file.type === "file") {
      router.push({
        pathname: "(drive)/(screens)/file/[id]",
        params: { id: file.id },
      });
    }
  };

  if (viewMode === "grid") {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
        <View
          style={[
            { width: gridCardSize, height: gridCardSize },
            style.gridCard,
          ]}
        >
          <View style={style.gridActions}>
            <ActionsMenu file={file} />
          </View>
          <View style={style.gridIconsContainer}>
            {file.starred && (
              <Icon
                name="star"
                size={theme.fonts.sizes.large}
                color={style.secondary.color}
              />
            )}
            {file.owner !== uuid && (
              <Icon
                name="shared"
                size={theme.fonts.sizes.large}
                color={style.secondary.color}
              />
            )}
          </View>
          <View style={style.gridIconContainer}>
            <Icon
              name={fileIconName}
              size={48}
              color={theme.colors.textSecondary}
            />
          </View>
          <Text style={style.gridName} numberOfLines={1}>
            {file.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <View style={style.row}>
        <View style={style.iconBackdrop}>
          <Icon
            name={fileIconName}
            size={style.iconBackdrop.fontSize}
            color={style.iconBackdrop.color}
          />
        </View>
        <View style={style.info}>
          <Text style={style.name}>{file.name}</Text>
          <View style={style.secondary}>
            {file.starred && (
              <Icon
                name="star"
                size={style.secondary.fontSize}
                color={style.secondary.color}
              />
            )}
            {file.owner !== uuid && (
              <Icon
                name="shared"
                size={style.secondary.fontSize}
                color={style.secondary.color}
              />
            )}
            <Text style={style.secondary}>{user.username}</Text>
            <Text
              style={[
                style.secondary,
                { fontWeight: theme.fonts.weights.bold },
              ]}
            >
              •
            </Text>
            <Text style={style.secondary}>
              <RelativeDate timestamp={file.modified} />
            </Text>
          </View>
        </View>

        <View style={style.listActions}>
          <ActionsMenu file={file} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
