import AskDemini from "./AskDemini";
import { View } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo, useState } from "react";
import { styles } from "@/styles/components/drive/tabs/header/Header.styles";
import MenuButton from "./MenuButton";
import SearchButton from "@/src/components/drive/tabs/header/SearchButton";
import Profile from "@/src/components/drive/common/Profile";
import { useAuth } from "@/src/contexts/AuthContext";
import LogoutButton from "@/src/components/drive/tabs/header/LogoutButton";
import PopupModal from "@/src/components/drive/common/PopupModal";
import { useRouter } from "expo-router";

export default function Header() {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);
  const { uuid } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuConfig = useMemo(
    () => ({
      title: {
        text: "Menu",
      },
      buttons: [
        {
          key: "settings",
          label: "Settings",
          onPress: () => {
            setMenuOpen(false);
            router.push("/(drive)/(screens)/settings");
          },
        },
        {
          key: "recent",
          label: "Recent",
          onPress: () => {
            setMenuOpen(false);
            router.push("/(drive)/(screens)/recent");
          },
        },
        {
          key: "trash",
          label: "Trash",
          onPress: () => {
            setMenuOpen(false);
            router.push("/(drive)/(screens)/trash");
          },
        },
      ],
    }),
    [router],
  );

  return (
    <>
      <View style={style.container}>
        <MenuButton onPress={() => setMenuOpen(true)} />
        <SearchButton
          onPress={() => router.push("/(drive)/(screens)/search")}
        />
        <AskDemini />
        <LogoutButton />
        <Profile uuid={uuid} size={40} />
      </View>
      <PopupModal
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        config={menuConfig}
      />
    </>
  );
}
