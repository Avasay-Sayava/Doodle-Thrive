import React, { useMemo } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import FileList from "@/src/components/drive/common/FileList";
import { useMoveFolder } from "@/src/hooks/api/files/useMoveFolder";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";
import { useFilesRefresh } from "@/src/contexts/FilesRefreshContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";
import { styles } from "@/styles/app/(drive)/(screens)/move/[id].styles";

export default function MoveScreen() {
  const { id, fileId, fileOwner } = useLocalSearchParams();
  const { theme } = useTheme();

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const style = useMemo(() => styles({ theme, insets }), [theme, insets]);

  const { files, currentFolder, loading, refresh } = useMoveFolder(
    id,
    fileId,
    fileOwner,
  );

  const { move } = useFilesActions();
  const { refreshAll } = useFilesRefresh();

  const handleFolderPress = (folder) => {
    router.push({
      pathname: `/(drive)/(screens)/move/${folder.id}`,
      params: { fileId, fileOwner },
    });
  };

  const handleMoveHere = async () => {
    try {
      const destinationId = id === "root" ? null : id;

      await move(fileId, destinationId);
      refreshAll();

      router.dismissAll();
      router.replace("/(drive)/(tabs)/files");
    } catch (err) {
      console.error("Failed to move file", err);
      alert("Failed to move file");
    }
  };

  return (
    <View style={style.container}>
      <Stack.Screen
        options={{
          title: loading ? "Loading..." : currentFolder?.name || "Move to...",
          headerBackTitle: "Back",
        }}
      />

      <View style={style.listContainer}>
        {loading && !files.length ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FileList
            files={files}
            onRefresh={refresh}
            refreshing={loading}
            onFilePress={handleFolderPress}
            viewMode="list"
            sortOptions={{ by: "name", reversed: false }}
            emptyComponent={() => (
              <View style={style.emptyContainer}>
                <Text style={style.emptyText}>
                  {id === "root" && fileOwner !== currentFolder?.owner
                    ? "Cannot move here (Owner mismatch)"
                    : "No valid subfolders"}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      <View style={style.footer}>
        <View style={style.footerContent}>
          <TouchableOpacity
            style={style.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={style.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <AnimatedPressable
            style={style.moveButton}
            backgroundColor={theme.colors.primary}
            onPress={handleMoveHere}
          >
            <Text style={style.moveText}>Move Here</Text>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}
