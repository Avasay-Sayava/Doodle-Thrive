import AskDemini from "./AskDemini";
import { View } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { styles } from "@/styles/components/drive/tabs/header/Header.styles";
import MenuButton from "./MenuButton";
import SearchButton from "@/src/components/drive/tabs/header/SearchButton";
import Profile from "@/src/components/drive/common/Profile";
import {useAuth} from "@/src/contexts/AuthContext";

export default function Header() {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);
  const { uuid } = useAuth();

  return (
    <View style={style.container}>
      <MenuButton />
      <SearchButton />
      <AskDemini />
      <Profile uuid={uuid} size={40} />
    </View>
  );
}
