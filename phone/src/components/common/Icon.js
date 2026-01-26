import { View } from "react-native";
import FileIcon from "@/assets/icons/file";
import FolderIcon from "@/assets/icons/folder";
import StarIcon from "@/assets/icons/star";
import SharedIcon from "@/assets/icons/shared";
import VerticalDotsIcon from "@/assets/icons/vertical-dots";
import ImageIcon from "@/assets/icons/image";
import { useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { styles } from "@/styles/components/common/Icon.styles";

export default function Icon({ name, size, color }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const IconComponent = (() => {
    switch (name) {
      case "file":
        return FileIcon;
      case "folder":
        return FolderIcon;
      case "star":
        return StarIcon;
      case "shared":
        return SharedIcon;
      case "vertical-dots":
        return VerticalDotsIcon;
      case "image":
        return ImageIcon;
      default:
        return null;
    }
  })();

  if (!IconComponent) return null;

  return (
    <View style={style.container}>
      <IconComponent size={size} color={color} />
    </View>
  );
}
