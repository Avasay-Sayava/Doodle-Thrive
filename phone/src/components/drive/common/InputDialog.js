import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles } from "@/styles/components/drive/common/InputDialog.styles";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";

export default function InputDialog({
  visible,
  onCancel,
  onConfirm,
  title,
  placeholder,
  initialValue = "",
  confirmLabel = "OK",
  cancelLabel = "Cancel",
}) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);
  const [text, setText] = useState(initialValue);

  useEffect(() => {
    if (visible) {
      setText(initialValue);
    }
  }, [visible, initialValue]);

  const handleConfirm = () => {
    onConfirm(text);
    setText("");
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={style.overlay}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={style.container}>
              <Text style={style.title}>{title}</Text>

              <TextInput
                style={style.input}
                value={text}
                onChangeText={setText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textMuted}
                autoFocus={true}
                selectAllOnFocus={true}
              />

              <View style={style.buttonContainer}>
                <AnimatedPressable
                  style={style.button}
                  onPress={onCancel}
                  backgroundColor={theme.colors.backgroundAlt}
                >
                  <Text
                    style={[style.buttonText, { color: theme.colors.text }]}
                  >
                    {cancelLabel}
                  </Text>
                </AnimatedPressable>

                <AnimatedPressable
                  style={[style.button, style.confirmButton]}
                  onPress={handleConfirm}
                  backgroundColor={theme.colors.primary}
                >
                  <Text
                    style={[
                      style.buttonText,
                      { color: theme.colors.background },
                    ]}
                  >
                    {confirmLabel}
                  </Text>
                </AnimatedPressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
