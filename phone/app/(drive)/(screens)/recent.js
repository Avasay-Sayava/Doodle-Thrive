import GeneralTab from "@/src/components/drive/tabs/GeneralTab";
import { useHome } from "@/src/hooks/api/files/useHome";
import ThemedText from "@/src/components/common/ThemedText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles as layoutStyles } from "@/styles/app/(drive)/(screens)/_layout.styles";
import { useMemo } from "react";

export default function Recent() {
  const { theme } = useTheme();
  const layoutStyle = useMemo(() => layoutStyles({ theme }), [theme]);

  return (
    <>
      <ThemedText style={layoutStyle.title}>Settings</ThemedText>
      <GeneralTab
        useFilesHook={useHome}
        initialSortOptions={{ by: "date", reversed: true }}
        initialViewMode="list"
        isSortEnabled={false}
      />
    </>
  );
}
