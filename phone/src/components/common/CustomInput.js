import * as ImagePicker from "expo-image-picker";
import ErrorLabel from "@/src/components/common/ErrorLabel";
import { TextInput, TouchableOpacity, View, Text, Image } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useMemo } from "react";
import { styles } from "@/styles/components/auth/FormInput.styles";

export default function CustomInput({
  type = "text",
  placeholder = "",
  value,
  onChange = () => {},
  errorMessage = "",
}) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);
  const error = errorMessage && errorMessage.length > 0;

  if (type === "image") {
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
      });

      if (!result.canceled) {
        onChange(result.assets[0].uri);
      }
    };

    return (
      <>
        <TouchableOpacity
          onPress={pickImage}
          style={[style.imageInput, error && style.inputError]}
        >
          {value ? (
            <Image source={{ uri: value }} style={style.imagePreview} />
          ) : (
            <View style={style.placeholderContainer}>
              <Text style={style.placeholderText}>{placeholder}</Text>
            </View>
          )}
        </TouchableOpacity>
        <ErrorLabel text={errorMessage} visible={error} />
      </>
    );
  }

  const secureTextEntry = type === "password";

  return (
    <>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={style.placeholderText.color}
        style={[style.textInput, error && style.inputError]}
      />
      <ErrorLabel text={errorMessage} visible={error} />
    </>
  );
}
