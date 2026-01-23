import { useSignUp } from "@/src/hooks/auth/useSignUp";
import { styles } from "@/styles/app/(auth).styles";

export default function SignUp() {
    const theme = useTheme();
    const style = useMemo(() => styles(theme), [theme]);
    const handleSignUp = useSignUp();

    return (
        <View style={style.form}>
            <ThemedText style={style.title}>Sign Up</ThemedText>
            <FormInput
                placeholder="username"
                value={username}
                onChange={setUsername}
            />
            <FormInput
                type="password"
                placeholder="password"
                value={password}
                onChange={setPassword}
                secureTextEntry
            />
            <SubmitForm
                title="Sign Up"
                onPress={() => handleSignUp(username, password, image, description)}
            />
            <Link href="/(auth)/signin">
                <ThemedText>Already have an account? Sign in</ThemedText>
            </Link>
        </View>
    )
}
