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

  const { files, refresh, loading } = useFilesHook();

  const data = [
    {
      id: "1234",
      name: "boomba!.png",
      type: "file",
      owner: "2f1acbc8-b406-41f6-81e9-86f5698944bc",
      content: "i nate higgers",
      trashed: false,
      created: Date.now(),
      modified: Date.now(),
      parent: null,
      starred: true,
      description: "bang!",
    },
    {
      id: "12324344",
      name: "boomba!1.webp",
      type: "folder",
      owner: "2f1acbc8-b406-41f6-81e9-86f5698944bc",
      content: "i nate higgers",
      trashed: false,
      created: Date.now(),
      modified: Date.now(),
      parent: "1234",
      starred: false,
      description: "bang!",
    },
    {
      id: "12323144",
      name: "boomba!1.png",
      type: "folder",
      owner: "2f1acbc8-b406-41f6-81e9-86f5698944bc",
      content: "i nate higgers",
      trashed: false,
      created: Date.now() - 1000,
      modified: Date.now() - 1000,
      parent: "1234",
      starred: false,
      description: "bang!",
    },
    {
      id: "1232314334",
      name: "boomba!1",
      type: "folder",
      owner: "2f1acbc8-b406-41f6-81e9-86f5698944bc",
      content: "i nate higgers",
      trashed: false,
      created: Date.now() - 1000,
      modified: Date.now() - 1000,
      parent: "1234",
      starred: false,
      description: "bang!",
    },
    {
      id: "123231423334",
      name: "boomba!1",
      type: "folder",
      owner: "2f1acbc8-b406-41f6-81e9-86f5698944bc",
      content: "i nate higgers",
      trashed: false,
      created: Date.now() - 1000,
      modified: Date.now() - 1000,
      parent: "1234",
      starred: false,
      description: "bang!",
    },
  ];

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
      <FileList
        files={/*TODO: replace with `files`*/ data}
        viewMode={viewMode}
        sortOptions={sortOptions}
      />
    </>
  );
}
