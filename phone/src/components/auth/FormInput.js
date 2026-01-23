import { StyleSheet, TextInput, View } from "react-native";
import ThemedText from "../common/ThemedText";

export const FormInput = ({
    type = "text",
    placeholder = "",
    value,
    onChange = () => {},
    secureTextEntry = false,
    error = false,
    errorMessage = "",
}) => {

    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            secureTextEntry={secureTextEntry}
        >
            <ErrorLabel>
                {error && errorMessage && <ThemedText>{errorMessage}</ThemedText>}
            </ErrorLabel>
        </TextInput>
    );
};