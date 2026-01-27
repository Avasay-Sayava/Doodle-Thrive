import { View } from "react-native";
import FileIcon from "@/assets/icons/file";
import ListIcon from "@/assets/icons/list";
import GridIcon from "@/assets/icons/grid";
import FolderIcon from "@/assets/icons/folder";
import StarIcon from "@/assets/icons/star";
import SharedIcon from "@/assets/icons/shared";
import VerticalDotsIcon from "@/assets/icons/vertical-dots";
import ImageIcon from "@/assets/icons/image";
import DeminiIcon from "@/assets/icons/demini";
import ArrowIcon from "@/assets/icons/arrow";
import SearchIcon from "@/assets/icons/search";
import ShareIcon from "@/assets/icons/share";
import LogoutIcon from "@/assets/icons/logout";
import BinIcon from "@/assets/icons/bin";
import DownloadIcon from "@/assets/icons/download";
import EditIcon from "@/assets/icons/edit";
import LinkIcon from "@/assets/icons/link";
import { useTheme } from "@/src/contexts/ThemeContext";
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
      case "list":
        return ListIcon;
      case "grid":
        return GridIcon;
      case "demini":
        return DeminiIcon;
      case "arrow":
        return ArrowIcon;
      case "search":
        return SearchIcon;
      case "share":
        return ShareIcon;
      case "logout":
        return LogoutIcon;
      case "trash":
        return BinIcon;
      case "download":
        return DownloadIcon;
      case "edit":
        return EditIcon;
      case "link":
        return LinkIcon;
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
