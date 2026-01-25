import CustomInput from "@/src/components/common/CustomInput";
import FormButton from "@/src/components/auth/FormButton";
import ThemedText from "@/src/components/common/ThemedText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useContext, useMemo, useState, useEffect } from "react";
import { styles } from "@/styles/app/(auth).styles";
import { View } from "react-native";
import { Link, useRouter } from "expo-router";
import { useSignUp } from "@/src/hooks/auth/useSignUp";
import { AuthFormsContext } from "@/app/(auth)/_layout";
import toBase64 from "@/src/utils/common/toBase64";

export default function SignUp() {
  const router = useRouter();

  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);
  const { handleSignUp } = useSignUp();

  const { usernameRef, passwordRef } = useContext(AuthFormsContext);

  const [username, setUsername] = useState(usernameRef.current || "");
  const [password, setPassword] = useState(passwordRef.current || "");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({
    username: null,
    password: null,
    image: null,
    description: null,
    general: null,
  });

  useEffect(() => {
    usernameRef.current = username;
  }, [username]);
  useEffect(() => {
    passwordRef.current = password;
  }, [password]);

  const onSignUp = async () => {
    try {
      const base64 = await toBase64(image?.uri);

      const success = await handleSignUp(
        username,
        password,
        base64,
        description,
        setErrors,
      );

      if (success) {
        setErrors({
          username: null,
          password: null,
          image: null,
          description: null,
          general: null,
        });
        router.replace("/(auth)/signin");
        return true;
      }
    } catch (err) {
      console.error(err);
    }

    return false;
  };

  return (
    <View style={style.form}>
      <ThemedText style={style.title}>Sign Up</ThemedText>
      <CustomInput
        placeholder="username"
        value={username}
        onChange={(text) => {
          setUsername(text);
        }}
        errorMessage={errors.username}
      />
      <CustomInput
        type="password"
        placeholder="password"
        value={password}
        onChange={(text) => {
          setPassword(text);
        }}
        errorMessage={errors.password}
      />
      <CustomInput
        type="image"
        placeholder="tap to select an image"
        value={image}
        onChange={(image) => {
          setImage(image);
        }}
        errorMessage={errors.image}
      />
      <CustomInput
        type="text"
        placeholder="description"
        value={description}
        onChange={(text) => {
          setDescription(text);
        }}
        errorMessage={errors.description}
      />
      <FormButton
        title="Sign Up"
        onPress={onSignUp}
        errorMessage={errors.general}
      />
      <Link style={style.link} href="/(auth)/signin">
        <ThemedText style={style.link}>
          Already have an account? Sign In
        </ThemedText>
      </Link>
    </View>
  );
}
