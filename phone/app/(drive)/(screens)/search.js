import GeneralTab from "@/src/components/drive/tabs/GeneralTab";
import { useSearch } from "@/src/hooks/api/files/useSearch";
import { useMemo, useState } from "react";
import SearchBar from "@/src/components/drive/common/SearchBar";
import ThemedText from "@/src/components/common/ThemedText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles as layoutStyles } from "@/styles/app/(drive)/(screens)/_layout.styles";

export default function Search() {
  const { theme } = useTheme();
  const layoutStyle = useMemo(() => layoutStyles({ theme }), [theme]);
  const [query, setQuery] = useState("");

  return (
    <>
      <ThemedText style={layoutStyle.title}>Search</ThemedText>
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
    </>
  );
}
