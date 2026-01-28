import React, { useState, useMemo } from "react";
import { View, Alert, TouchableOpacity, Text } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/src/contexts/ThemeContext";
import PopupModal from "@/src/components/drive/common/PopupModal";
import InputDialog from "@/src/components/drive/common/InputDialog";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";
import { useFilesRefresh } from "@/src/contexts/FilesRefreshContext";
import { styles } from "@/styles/components/drive/tabs/New.styles";

const imageExtensionRegex = /\.(jpg|jpeg|png|webp)$/i;

const isImageAsset = (asset) => {
  if (asset?.mimeType?.startsWith("image/")) return true;
  return imageExtensionRegex.test(asset?.name || "");
};

export default function New({ currentFolderId = null }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const style = useMemo(() => styles({ theme, insets }), [theme, insets]);

  const { createFolder, createFile } = useFilesActions();
  const { refreshAll } = useFilesRefresh();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [folderDialogVisible, setFolderDialogVisible] = useState(false);
  const [fileDialogVisible, setFileDialogVisible] = useState(false);

  const handleCreateFolder = async (name) => {
    setFolderDialogVisible(false);
    if (!name) return;

    try {
      await createFolder(name, currentFolderId);
      refreshAll();
    } catch (error) {
      console.error("Create folder failed:", error);
      Alert.alert("Error", "Failed to create folder");
    }
  };

  const handleCreateFile = async (name) => {
    setFileDialogVisible(false);
    if (!name) return;

    try {
      await createFile(name, "", currentFolderId);
      refreshAll();
    } catch (error) {
      console.error("Create file failed:", error);
      Alert.alert("Error", "Failed to create file");
    }
  };

  const handleUpload = async () => {
    setIsMenuOpen(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      const isImage = isImageAsset(asset);
      const content = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: isImage ? "base64" : "utf8",
      });

      await createFile(asset.name, content, currentFolderId);
      refreshAll();
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert(
        "Error",
        "Failed to upload file. Ensure it is a valid text file.",
      );
    }
  };

  const menuConfig = {
    title: {
      text: "Create New",
      icon: { name: "add" },
    },
    buttons: [
      {
        key: "file",
        icon: "file",
        label: "File",
        onPress: () => {
          setIsMenuOpen(false);
          setTimeout(() => setFileDialogVisible(true), 100);
        },
      },
      {
        key: "folder",
        icon: "folder",
        label: "Folder",
        onPress: () => {
          setIsMenuOpen(false);
          setTimeout(() => setFolderDialogVisible(true), 100);
        },
      },
      {
        key: "upload",
        icon: "arrow",
        label: "Upload",
        onPress: handleUpload,
      },
    ],
  };

  return (
    <>
      <View style={style.wrapper} pointerEvents="box-none">
        <TouchableOpacity
          style={style.button}
          onPress={() => setIsMenuOpen(true)}
          activeOpacity={0.75}
        >
          <Text style={style.plus}>+</Text>
        </TouchableOpacity>
      </View>

      <PopupModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        config={menuConfig}
      />

      <InputDialog
        visible={folderDialogVisible}
        onCancel={() => setFolderDialogVisible(false)}
        onConfirm={handleCreateFolder}
        title="New Folder"
        placeholder="Folder name"
        confirmLabel="Create"
      />

      <InputDialog
        visible={fileDialogVisible}
        onCancel={() => setFileDialogVisible(false)}
        onConfirm={handleCreateFile}
        title="New File"
        placeholder="File name"
        confirmLabel="Create"
      />
    </>
  );
}
