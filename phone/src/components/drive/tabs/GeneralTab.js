import { useEffect, useMemo, useState } from "react";
import TabHeader from "./TabHeader";
import FileList from "./FileList";
import LocalStorage from "@/src/utils/common/LocalStorage";

export default function GeneralTab({
  useFilesHook,
  requiresUuid = true,
  initialSortBy = "name",
  isSortEnabled = true,
}) {
  const [fileView, setFileView] = useState("grid");
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [files, setFiles] = useState({});

  const { refresh } = useFilesHook();
  const uuid = useMemo(() => LocalStorage.get("uuid"), []);

  useEffect(() => {
    const nextFiles = requiresUuid ? refresh(uuid) : refresh();
    setFiles(nextFiles);
  }, [uuid, refresh, requiresUuid]);

  return (
    <>
      <TabHeader
        sortBy={sortBy}
        setSortBy={setSortBy}
        isSortEnabled={isSortEnabled}
        fileView={fileView}
        setFileView={setFileView}
      />
      <FileList files={files} fileView={fileView} sortBy={sortBy} />
    </>
  );
}