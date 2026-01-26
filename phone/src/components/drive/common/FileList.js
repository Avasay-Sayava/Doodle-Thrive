import File from "@/src/components/drive/common/File";
import { ScrollView, View } from "react-native";
import { styles } from "@/styles/components/drive/common/FileList.styles";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";

const nameComparator = (a, b) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase());
const dateComparator = (a, b) => a.modified - b.modified;

export default function FileList({ files, viewMode, sortOptions }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const sorted = files
    .sort(sortOptions.by === "date" ? dateComparator : nameComparator)
    .map((file) => <File file={file} />);
  const reversed = sortOptions.reversed ? sorted.reverse() : sorted;

  return (
    <ScrollView contentContainerStyle={style.fill}>
      <View style={style.container}>{reversed}</View>
    </ScrollView>
  );
}
