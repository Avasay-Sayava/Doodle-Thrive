import { useEffect, useMemo, useState } from "react";
import TabHeader from "./TabHeader";
import FilePanel from "./FilePanel";
import LocalStorage from "@/src/utils/common/LocalStorage";

// General drive tab layout: handles view mode, sorting, and loading files.
//
// Props:
// - useFilesHook: React hook that returns an object with a `refresh` function
//   (e.g. useFolder, useStarred, useShared).
// - requiresUuid: whether the refresh function expects a uuid argument.
// - initialSortBy: initial sort field key.
// - isSortEnabled: whether sorting controls should be enabled/shown.
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
      <FilePanel files={files} fileView={fileView} sortBy={sortBy} />
    </>
  );
}