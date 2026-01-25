import { useEffect, useState, useMemo } from "react";
import TabHeader from "@/src/components/drive/tabs/TabHeader";
import FilePanel from "@/src/components/drive/tabs/FilePanel";
import { useShared } from "@/src/hooks/api/files/useShared";

export default function Shared() {
  const [fileView, setFileView] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const uuid = useMemo(async () => LocalStorage.get("uuid"), []);
  const { refresh } = useShared();
  const [sharedFiles, setSharedFiles] = useState({});

  useEffect(() => {
    const sharedFiles = refresh(uuid);
    setSharedFiles(sharedFiles);
  }, [uuid, refresh]);

  return (
    <>
      <TabHeader
        sortBy={sortBy}
        setSortBy={setSortBy}
        fileView={fileView}
        setFileView={setFileView}
      />
      <FilePanel files={sharedFiles} fileView={fileView} sortBy={sortBy} />
    </>
  );
}
