import FormInput from "@/src/components/auth/FormInput";
import FormButton from "@/src/components/auth/FormButton";
import ThemedText from "@/src/components/common/ThemedText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo, useState, useEffect, useContext } from "react";
import { styles } from "@/styles/app/(auth).styles";
import { View } from "react-native";
import { Link, useRouter } from "expo-router";
import { useSignIn } from "@/src/hooks/auth/useSignIn";
import { AuthFormsContext } from "./_layout";

export default function SignIn() {
  const router = useRouter();

  const { theme } = useTheme();
  const style = useMemo(() => styles(theme), [theme]);
  const { handleSignIn } = useSignIn();

  const { usernameRef, passwordRef } = useContext(AuthFormsContext);

  const [username, setUsername] = useState(usernameRef.current || "");
  const [password, setPassword] = useState(passwordRef.current || "");

  const [errorMessage, setErrorMessage] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    usernameRef.current = username;
  }, [username]);
  useEffect(() => {
    passwordRef.current = password;
  }, [password]);

  const onSignIn = async () => {
    const success = await handleSignIn(username, password);
    if (success) {
      setErrorMessage(null);
      setError(false);
      router.replace("/(drive)");
      return true;
    } else {
      setErrorMessage("Invalid username or password!");
      setError(true);
      return false;
    }
  };

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
      <FormButton
        title="Sign In"
        onPress={onSignIn}
        error={error}
        errorMessage={errorMessage}
      />
      <Link style={style.link} href="/(auth)/signup">
        <ThemedText style={style.link}>
          Don't have an account? Sign Up
        </ThemedText>
      </Link>
    </View>
  );
}
