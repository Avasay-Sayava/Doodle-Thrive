import GeneralTab from "@/src/components/drive/tabs/GeneralTab";
import { useShared } from "@/src/hooks/api/files/useShared";

export default function Shared() {
  return (
    <GeneralTab
      useFilesHook={useShared}
      initialSortBy="name"
      isSortEnabled={true}
    />
  );
}
