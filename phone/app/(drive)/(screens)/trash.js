import GeneralScreenLayout from "@/src/components/drive/screens/GeneralScreenLayout";
import GeneralTab from "@/src/components/drive/tabs/GeneralTab";
import { useTrashed } from "@/src/hooks/api/files/useTrashed";

export default function Trash() {
    return (
        <GeneralScreenLayout>
            <GeneralTab
                useFilesHook={useTrashed}
                initialSortOptions={{ by: "name", reversed: false }}
                initialViewMode="list"
                isSortEnabled={true}
            />
        </GeneralScreenLayout>
    );
}