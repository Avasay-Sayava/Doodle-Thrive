import GeneralTab from "@/src/components/drive/tabs/GeneralTab";
import New from "@/src/components/drive/tabs/New";
import { useFolder } from "@/src/hooks/api/files/useFolder";
import { useLocalSearchParams } from "expo-router";

export default function Folder() {
  const params = useLocalSearchParams();
  const folderId = params.id;

  return (
    <>
      <GeneralTab
        useFilesHook={() => useFolder(folderId)}
        initialSortOptions={{ by: "name", reversed: false }}
        initialViewMode="grid"
        isSortEnabled={true}
      />
      <New currentFolderId={folderId} />
    </>
  );
}
