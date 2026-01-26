import GeneralTab from "@/src/components/drive/tabs/GeneralTab";
import { useFolder } from "@/src/hooks/api/files/useFolder";

export default function Home() {
  return (
    <GeneralTab
      useFilesHook={() => useFolder(null)}
      initialSortBy="name"
      isSortEnabled={true}
    />
  );
}
