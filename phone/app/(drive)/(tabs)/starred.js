import GeneralTab from "@/src/components/drive/tabs/GeneralTab";
import { useStarred } from "@/src/hooks/api/files/useStarred";

export default function Starred() {
  return (
    <GeneralTab
      useFilesHook={useStarred}
      initialSortOptions={{ by: "list", reversed: false }}
      initialViewMode="list"
      isSortEnabled={true}
    />
  );
}
