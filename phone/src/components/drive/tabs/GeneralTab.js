import { useState } from "react";
import TabHeader from "./TabHeader";
import FileList from "@/src/components/drive/common/FileList";
import LoadingScreen from "@/src/components/common/LoadingScreen";

export default function GeneralTab({
  useFilesHook,
  initialSortOptions,
  initialViewMode = "list",
  isSortEnabled = true,
}) {
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [sortOptions, setSortOptions] = useState(initialSortOptions);

  const { files, loading } = useFilesHook();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TabHeader
        sortOptions={sortOptions}
        setSortOptions={setSortOptions}
        isSortEnabled={isSortEnabled}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <FileList files={files} viewMode={viewMode} sortOptions={sortOptions} />
    </>
  );
}
