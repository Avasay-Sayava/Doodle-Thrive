import { useEffect, useState } from "react";
import TabHeader from "@/src/components/drive/tabs/TabHeader";
import FilePanel from "@/src/components/drive/tabs/FilePanel";
import { useStarred } from "@/src/hooks/api/files/useStarred";

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
