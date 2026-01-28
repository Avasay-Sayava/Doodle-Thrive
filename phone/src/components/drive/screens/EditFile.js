import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles } from "@/styles/components/drive/screens/EditFile.styles";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";
import { useFilesRefresh } from "@/src/contexts/FilesRefreshContext";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function EditFile({ file, onSaved }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);
  const { edit } = useFilesActions();
  const { refreshAll } = useFilesRefresh();
  const insets = useSafeAreaInsets();

  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setText(typeof file?.content === "string" ? file.content : "");
  }, [file]);

  const handleSave = async () => {
    if (!file?.id || saving) return;
    setSaving(true);
    try {
      await edit(file.id, text);
      refreshAll();
      if (onSaved) onSaved();
    } catch (error) {
      console.error("Save failed:", error);
      Alert.alert("Error", "Failed to save file");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.header}>
        <Text style={style.title} numberOfLines={2}>
          {file.name}
        </Text>
      </View>
      <ScrollView
        style={style.editorContainer}
        contentContainerStyle={style.editorContent}
      >
        <TextInput
          style={style.input}
          value={text}
          onChangeText={setText}
          placeholder="Type here..."
          placeholderTextColor={theme.colors.textMuted}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>
      <AnimatedPressable
        onPress={handleSave}
        disabled={saving}
        style={[
          style.saveButton,
          {
            right: theme.spacing.medium + insets.right,
            bottom: theme.spacing.medium + insets.bottom,
          },
        ]}
        backgroundColor={theme.colors.primary + "22"}
        durationIn={50}
        durationOut={150}
      >
        <Text style={style.saveButtonText}>
          {saving ? "Saving..." : "Save"}
        </Text>
      </AnimatedPressable>
    </SafeAreaView>
  );
}
