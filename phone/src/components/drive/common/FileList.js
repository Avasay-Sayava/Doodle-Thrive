import File from "@/src/components/drive/common/File";
import { ScrollView, View, Text, RefreshControl } from "react-native";
import { styles } from "@/styles/components/drive/common/FileList.styles";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";

const nameComparator = (a, b) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase());
const dateComparator = (a, b) => a.modified - b.modified;

export default function FileList({
  files,
  viewMode,
  sortOptions = { by: "name", reversed: false },
  onFilePress,
  onRefresh,
  refreshing = false,
  emptyComponent,
}) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const sorted = [...files].sort(
    sortOptions.by === "date" ? dateComparator : nameComparator,
  );

  const reversed = sortOptions.reversed ? sorted.reverse() : sorted;

  return (
    <ScrollView
      contentContainerStyle={files.length === 0 ? style.centerContainer : null}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        ) : undefined
      }
    >
      <View
        style={viewMode === "grid" ? style.gridContainer : style.listContainer}
      >
        {files.length === 0 ? (
          emptyComponent ? (
            emptyComponent()
          ) : (
            <Text style={style.emptyText}>No files found</Text>
          )
        ) : (
          reversed.map((file) => (
            <File
              key={file.id || file.uuid}
              file={file}
              viewMode={viewMode}
              onPress={onFilePress}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
