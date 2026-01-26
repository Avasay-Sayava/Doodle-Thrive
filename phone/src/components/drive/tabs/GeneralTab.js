import { useEffect, useState } from "react";
import TabHeader from "./TabHeader";
import FileList from "@/src/components/drive/common/FileList";
import LoadingScreen from "@/src/components/common/LoadingScreen";

export default function GeneralTab({
  useFilesHook,
  initialSortOptions = { by: "name", reversed: false },
  initialViewMode = "grid",
  isSortEnabled = true,
}) {
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [sortOptions, setSortOptions] = useState(initialSortOptions);

  const { refresh, loading } = useFilesHook();

  const data = [
    {
      id: "1234",
      name: "bomba!",
      type: "file",
      owner: "i nate higgers",
      content: "i nate higgers",
      trashed: false,
      created: Date.now(),
      modified: Date.now(),
      parent: null,
      starred: true,
      description: "bang!",
    },
    {
      id: "12344",
      name: "bomba!1",
      type: "folder",
      owner: "i nate higgers2",
      content: "i nate higgers",
      trashed: false,
      created: Date.now(),
      modified: Date.now(),
      parent: "1234",
      starred: false,
      description: "bang!",
    },
  ];

  useEffect(() => {
    refresh();
  }, [refresh]);

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
      <FileList files={data} viewMode={viewMode} sortOptions={sortOptions} />
    </>
  );
}
