import GeneralTab from "@/src/components/drive/tabs/GeneralTab";
import { useTrashed } from "@/src/hooks/api/files/useTrashed";

export default function Trash() {
  return (
    <GeneralTab
      useFilesHook={useTrashed}
      initialSortOptions={{ by: "name", reversed: false }}
      initialViewMode="list"
      isSortEnabled={true}
    />
  );
}
