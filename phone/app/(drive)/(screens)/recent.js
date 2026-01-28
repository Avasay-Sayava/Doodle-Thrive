import GeneralScreenLayout from "@/src/components/drive/screens/GeneralScreenLayout";
import GeneralTab from "@/src/components/drive/tabs/GeneralTab";
import { useHome } from "@/src/hooks/api/files/useHome";

export default function Recent() {
    return (
        <GeneralScreenLayout>
            <GeneralTab
                useFilesHook={useHome}
                initialSortOptions={{ by: "date", reversed: true }}
                initialViewMode="list"
                isSortEnabled={false}
            />
        </GeneralScreenLayout>
    )
}