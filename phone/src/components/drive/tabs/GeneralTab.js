import { useEffect, useState } from "react";
import TabHeader from "./TabHeader";
import FileList from "@/src/components/drive/common/FileList";

export default function GeneralTab({
  useFilesHook,
  initialSortBy = "name",
  isSortEnabled = true,
}) {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [files, setFiles] = useState([]);

  const { refresh } = useFilesHook();

  useEffect(() => {
    const nextFiles = refresh();
    setFiles(nextFiles);
  }, [refresh]);

  return (
    <>
      <TabHeader
        sortBy={sortBy}
        setSortBy={setSortBy}
        isSortEnabled={isSortEnabled}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <FileList files={files} viewMode={viewMode} sortBy={sortBy} />
    </>
  );
}
