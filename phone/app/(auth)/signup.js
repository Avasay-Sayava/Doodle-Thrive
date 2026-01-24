import FormInput from "@/src/components/auth/FormInput";
import ThemedText from "@/src/components/common/ThemedText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo, useState } from "react";
import { styles } from "@/styles/app/(auth).styles";
import { Button, View } from "react-native";
import { Link } from "expo-router";
import { useSignUp } from "@/src/hooks/auth/useSignUp";

export default function SignUp() {
  const { theme } = useTheme();
  const style = useMemo(() => styles(theme), [theme]);
  const { handleSignUp } = useSignUp();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  return (
    <View style={style.form}>
      <ThemedText style={style.title}>Sign Up</ThemedText>
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
      <FormInput
        type="image"
        value={image}
        onChange={(uri) => {
          setImage(uri);
        }}
      />
      <FormInput
        type="text"
        placeholder="description"
        value={description}
        onChange={(text) => {
          setDescription(text);
        }}
      />
      <Button
        title="Sign Up"
        onPress={() => handleSignUp(username, password)}
      />
      <Link style={style.link} href="/(auth)/signin">
        <ThemedText>Already have an account? Sign In</ThemedText>
      </Link>
    </View>
  );
}
