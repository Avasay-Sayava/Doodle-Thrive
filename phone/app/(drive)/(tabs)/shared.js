import GeneralTab from "@/src/components/drive/tabs/GeneralTab";
import { useShared } from "@/src/hooks/api/files/useShared";

export default function Shared() {
  return (
    <GeneralTab
      useFilesHook={useShared}
      initialSortOptions={{ by: "name", reversed: false }}
      initialViewMode="list"
      isSortEnabled={true}
    />
  );
}
