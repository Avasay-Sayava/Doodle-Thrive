import GeneralTab from "@/src/components/drive/tabs/GeneralTab";
import { useFiles } from "@/src/hooks/api/files/useFiles";

export default function Files() {
  return (
    <GeneralTab
      useFilesHook={useFiles}
      requiresUuid={true}
      initialSortBy="name"
      isSortEnabled={true}
    />
  );
}