import { useMemo, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles } from "@/styles/components/drive/screens/file.styles";
import LoadingScreen from "@/src/components/common/LoadingScreen";
import { useFile } from "@/src/hooks/api/files/useFile";
import EditFile from "@/src/components/drive/screens/EditFile";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";
import isImageName from "@/src/utils/common/isImageName";
const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

const getImageDataUri = (filename, content) => {
  if (!content || !base64Regex.test(content) || content.length % 4 !== 0) {
    return null;
  }

  const match = filename.match(/\.(jpg|jpeg|png|webp)$/i);
  const ext = match ? match[1].toLowerCase() : null;
  const type = ext === "jpg" ? "jpeg" : ext;

  return type ? `data:image/${type};base64,${content}` : null;
};

export default function ViewFile() {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);
  const params = useLocalSearchParams();
  const fileId = params.id;

  const { file, loading, error } = useFile(fileId);
  const [isEditing, setIsEditing] = useState(false);
  const insets = useSafeAreaInsets();

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !file) {
    return (
      <View style={style.stateContainer}>
        <Text style={style.stateText}>Unable to load file.</Text>
      </View>
    );
  }

  const content = typeof file.content === "string" ? file.content : "";
  const isImage = file.type === "file" && isImageName(file.name);
  const imageUri = isImage ? getImageDataUri(file.name, content) : null;

  if (isImage) {
    return (
      <SafeAreaView style={style.scroll}>
        <ScrollView contentContainerStyle={style.contentContainer}>
          <Text style={style.title} numberOfLines={2}>
            {file.name}
          </Text>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={style.image} />
          ) : (
            <Text style={style.stateText}>Image preview not available.</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isEditing) {
    return <EditFile file={file} onSaved={() => setIsEditing(false)} />;
  }

  return (
    <SafeAreaView style={style.scroll}>
      <ScrollView contentContainerStyle={style.contentContainer}>
        <Text style={style.title} numberOfLines={2}>
          {file.name}
        </Text>
        <Text style={style.bodyText}>{content || "Empty file."}</Text>
      </ScrollView>
      <AnimatedPressable
        onPress={() => setIsEditing(true)}
        style={[
          style.editButton,
          {
            right: theme.spacing.medium + insets.right,
            bottom: theme.spacing.medium + insets.bottom,
          },
        ]}
        backgroundColor={theme.colors.primary + "22"}
        durationIn={50}
        durationOut={150}
      >
        <Text style={style.editButtonText}>Edit</Text>
      </AnimatedPressable>
    </SafeAreaView>
  );
}
