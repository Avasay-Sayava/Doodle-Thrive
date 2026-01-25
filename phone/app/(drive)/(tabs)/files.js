import { useEffect, useState, useMemo } from "react";
import ThemedText from "@/src/components/common/ThemedText";
import TabHeader from "@/src/components/drive/tabs/TabHeader";
import FilePanel from "@/src/components/drive/tabs/FilePanel";
import { useFolder } from "@/src/hooks/api/files/useFolder";
import LocalStorage from "@/src/utils/common/LocalStorage";

export default function Files() {
  const [fileView, setFileView] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const uuid = useMemo(async () => LocalStorage.get("uuid"), []);
  const [files, setFiles] = useState({});
  const { refresh } = useFolder();

  useEffect(() => {
    const files = refresh(uuid);
    setFiles(files);
  }, [uuid, refresh]);

  return (
    <>
      <TabHeader
        sortBy={sortBy}
        setSortBy={setSortBy}
        fileView={fileView}
        setFileView={setFileView}
      />
      <FilePanel files={files} fileView={fileView} sortBy={sortBy} />
    </>
  );
}