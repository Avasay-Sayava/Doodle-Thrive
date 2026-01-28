import GeneralTab from "@/src/components/drive/tabs/GeneralTab";
import { useTrashed } from "@/src/hooks/api/files/useTrashed";
import ThemedText from "@/src/components/common/ThemedText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { styles as layoutStyles } from "@/styles/app/(drive)/(screens)/_layout.styles";

export default function Trash() {
  const { theme } = useTheme();
  const layoutStyle = useMemo(() => layoutStyles({ theme }), [theme]);

  return (
    <>
      <ThemedText style={layoutStyle.title}>Settings</ThemedText>
      <GeneralTab
        useFilesHook={useTrashed}
        initialSortOptions={{ by: "name", reversed: false }}
        initialViewMode="list"
        isSortEnabled={true}
      />
    </>
  );
}
