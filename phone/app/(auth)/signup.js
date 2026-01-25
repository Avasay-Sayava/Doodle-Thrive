import FormInput from "@/src/components/auth/FormInput";
import FormButton from "@/src/components/auth/FormButton";
import ThemedText from "@/src/components/common/ThemedText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useContext, useMemo, useState, useEffect } from "react";
import { styles } from "@/styles/app/(auth).styles";
import { View } from "react-native";
import { Link, router } from "expo-router";
import { useSignUp } from "@/src/hooks/auth/useSignUp";
import { AuthFormsContext } from "@/app/(auth)/_layout";
import { useRouter } from "expo-router";

export default function SignUp() {
  const router = useRouter();

  const { theme } = useTheme();
  const style = useMemo(() => styles(theme), [theme]);
  const { handleSignUp } = useSignUp();

  const { usernameRef, passwordRef } = useContext(AuthFormsContext);

  const [username, setUsername] = useState(usernameRef.current || "");
  const [password, setPassword] = useState(passwordRef.current || "");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({username: null, password: null, image: null, description: null, general: null});
    
  useEffect(() => {
    usernameRef.current = username;
  }, [username]);
  useEffect(() => {
    passwordRef.current = password;
  }, [password]);

  const onSignUp = async () => {
    const success = await handleSignUp(username, password, image, description, setErrors);
    if (success) {
      setErrors({username: null, password: null, image: null, description: null, general: null});
      router.replace("/(auth)/signin");
      return true;
    }
  }

  return (
    <View style={style.form}>
      <ThemedText style={style.title}>Sign Up</ThemedText>
      <FormInput
        placeholder="username"
        value={username}
        onChange={(text) => {
          setUsername(text);
        }}
        errorMessage={errors.username}
      />
      <FormInput
        type="password"
        placeholder="password"
        value={password}
        onChange={(text) => {
          setPassword(text);
        }}
        errorMessage={errors.password}
      />
      <FormInput
        type="image"
        value={image}
        onChange={(uri) => {
          setImage(uri);
        }}
        errorMessage={errors.image}
      />
      <FormInput
        type="text"
        placeholder="description"
        value={description}
        onChange={(text) => {
          setDescription(text);
        }}
        errorMessage={errors.description}
      />
      <FormButton title="Sign Up" onPress={onSignUp} error={!!errors.general} errorMessage={errors.general} />
      <Link style={style.link} href="/(auth)/signin">
        <ThemedText style={style.link}>Already have an account? Sign In</ThemedText>
      </Link>
    </View>
  );
}
