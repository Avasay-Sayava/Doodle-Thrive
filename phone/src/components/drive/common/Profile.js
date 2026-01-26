import React, { useMemo } from "react";
import { View, Text, Image } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useUser } from "@/src/hooks/api/users/useUser";
import { styles } from "@/styles/components/drive/common/Profile.styles";

export default function Profile({ uuid, size, style: customStyle }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme, size }), [theme, size]);
  const { user } = useUser(uuid);

  console.log(user);

  if (user?.info?.image) {
    return (
      <Image
        source={{ uri: user.info.image }}
        style={[style.container, customStyle]}
      />
    );
  }

  const letter = user?.username?.charAt(0).toUpperCase();

  return (
    <View style={[style.container, customStyle]}>
      {letter && <Text style={style.text}>{letter}</Text>}
    </View>
  );
}
