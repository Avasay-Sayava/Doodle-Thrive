import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { styles } from "@/styles/components/drive/common/SearchBar.styles";

export default function SearchBar() {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  return <></>;
}
