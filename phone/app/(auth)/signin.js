import FormInput from "@/src/components/auth/FormInput";
import ThemedText from "@/src/components/common/ThemedText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo, useState } from "react";
import { styles } from "@/styles/app/(auth).styles";
import { Button, View } from "react-native";
import { Link } from "expo-router";
import { useSignIn } from "@/src/hooks/auth/useSignIn";

export default function SignIn() {
  const { theme } = useTheme();
  const style = useMemo(() => styles(theme), [theme]);
  const { handleSignIn } = useSignIn();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={style.form}>
      <ThemedText style={style.title}>Sign In</ThemedText>
      <FormInput
        placeholder="username"
        value={username}
        onChange={(text) => {
          setUsername(text);
        }}
      />
      <FormInput
        type="password"
        placeholder="password"
        value={password}
        onChange={(text) => {
          setPassword(text);
        }}
      />
      <Button
        title="Sign In"
        onPress={() => handleSignIn(username, password)}
      />
      <Link style={style.link} href="/(auth)/signup">
        <ThemedText style={style.link}>Don't have an account? Sign Up</ThemedText>
      </Link>
    </View>
  );
}
