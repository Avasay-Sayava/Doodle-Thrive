import GeneralScreenLayout from "@/src/components/drive/screens/GeneralScreenLayout";
import GeneralTab from "@/src/components/drive/tabs/GeneralTab";
import { useSearch } from "@/src/hooks/api/files/useSearch";
import { useState } from "react";
import SearchBar from "@/src/components/drive/common/SearchBar";

export default function Search() {
    const [query, setQuery] = useState("");


    
    return (
        <GeneralScreenLayout>
            <SearchBar
                value={query}
                onChangeText={setQuery}
                placeholder="Search files"
            />
            <GeneralTab
				useFilesHook={() => useSearch(query)}
                initialSortOptions={{ by: "date", reversed: true }}
                initialViewMode="list"
                isSortEnabled={true}
            />
        </GeneralScreenLayout>
    )
}
