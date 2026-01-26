import { View } from "react-native";
import FileIcon from "@/assets/icons/file.js"
import FolderIcon from "@/assets/icons/folder.js"
import StarIcon from "@/assets/icons/star.js"
import SharedIcon from "@/assets/icons/shared.js"
import VerticalDotsIcon from "@/assets/icons/vertical-dots.js"
import ImageIcon from "@/assets/icons/image.js"
import { useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { styles } from "@/styles/components/common/Icon.styles";

export default function Icon({ name, size, color }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const IconComponent = (() => {
    switch (name) {
      case "file": return FileIcon;
      case "folder": return FolderIcon;
      case "star": return StarIcon;
      case "shared": return SharedIcon;
      case "vertical-dots": return VerticalDotsIcon;
      case "image": return ImageIcon;
      default: return null;
    }
  })();

  if (!IconComponent) return null;

  return (
    <View style={style.container}>
      <IconComponent size={size} fill={color} />
    </View>
  );
}
