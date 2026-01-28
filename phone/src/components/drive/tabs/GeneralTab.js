import { useState } from "react";
import TabHeader from "./TabHeader";
import FileList from "@/src/components/drive/common/FileList";
import LoadingScreen from "@/src/components/common/LoadingScreen";
import { View } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";

export default function GeneralTab({
  useFilesHook,
  initialSortOptions,
  initialViewMode = "list",
  isSortEnabled = true,
}) {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [sortOptions, setSortOptions] = useState(initialSortOptions);

  const { files, loading } = useFilesHook();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TabHeader
        sortOptions={sortOptions}
        setSortOptions={setSortOptions}
        isSortEnabled={isSortEnabled}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <FileList files={files} viewMode={viewMode} sortOptions={sortOptions} />
    </View>
  );
}
