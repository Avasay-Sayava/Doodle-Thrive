import { useEffect, useState, useMemo } from "react";
import TabHeader from "@/src/components/drive/tabs/TabHeader";
import FilePanel from "@/src/components/drive/tabs/FilePanel";
import { useStarred } from "@/src/hooks/api/files/useStarred";
import LocalStorage from "@/src/utils/common/LocalStorage";

export default function Starred() {
  const [fileView, setFileView] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const uuid = useMemo(async () => LocalStorage.get("uuid"), []);
  const [starredFiles, setStarredFiles] = useState({});
  const { refresh } = useStarred();

  useEffect(() => {
    const files = refresh();
    setStarredFiles(files);
  }, [uuid, refresh]);

  return (
    <>
      <TabHeader
        sortBy={sortBy}
        setSortBy={setSortBy}
        fileView={fileView}
        setFileView={setFileView}
      />
      <FilePanel files={starredFiles} fileView={fileView} sortBy={sortBy} />
    </>
  );
}
