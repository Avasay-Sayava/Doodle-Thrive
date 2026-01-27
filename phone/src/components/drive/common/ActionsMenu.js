import React, { useState, useMemo, useEffect } from "react";
import { View, Text, ScrollView, Clipboard } from "react-native";
import * as Linking from "expo-linking";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles } from "@/styles/components/drive/common/ActionsMenu.styles";
import Icon from "@/src/components/common/Icon";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";
import { useOrientation } from "@/src/hooks/common/useOrientation";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";
import InputDialog from "@/src/components/drive/common/InputDialog";
import { useFilesRefresh } from "@/src/contexts/FilesRefreshContext";
import FileIcon from "@/src/components/drive/common/FileIcon";
import PopupModal from "@/src/components/drive/common/PopupModal";

export default function ActionsMenu({ file }) {
  const orientation = useOrientation();
  useEffect(() => {}, [orientation]);

  const { refreshAll } = useFilesRefresh();
  const [isOpen, setIsOpen] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);

  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const { star, trash, duplicate, rename } = useFilesActions();

  const triggerRefresh = () => {
    refreshAll();
  };

  const openMenu = () => {
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleShare = () => {
    closeMenu();
    // TODO
    console.log("Share action triggered");
  };

  const handleStar = async () => {
    closeMenu();
    star(file.id, !file.starred);
    triggerRefresh();
  };

  const handleCopyLink = async () => {
    closeMenu();
    const path =
      file.type === "folder"
        ? `(drive)/(screens)/folder/${file.id}`
        : `(drive)/(screens)/file/${file.id}`;

    const url = Linking.createURL(path);
    console.log("Generated Link:", url);
    Clipboard.setString(url);
  };

  const handleDuplicate = async () => {
    closeMenu();
    duplicate(file.id);
    triggerRefresh();
  };

  const handleDownload = () => {
    closeMenu();
    // TODO
    console.log("Download action triggered");
  };

  const handleRenameOpen = () => {
    setIsOpen(false);
    setRenameVisible(true);
  };

  const handleRenameConfirm = async (newName) => {
    setRenameVisible(false);
    if (newName && newName !== file.name) {
      rename(file.id, newName);
      triggerRefresh();
    }
  };

  const handleMove = () => {
    closeMenu();
    // TODO
    console.log("Move action triggered");
  };

  const handleTrash = async () => {
    closeMenu();
    trash(file.id, true);
    triggerRefresh();
  };

  const isFile =
    file.type === "file" || (file.type !== "folder" && file.type !== "dir");

  return (
    <>
      <AnimatedPressable
        onPress={openMenu}
        style={style.triggerButton}
        backgroundColor={theme.colors.text + "22"}
        durationIn={50}
        durationOut={150}
      >
        <Icon
          name="vertical-dots"
          size={theme.fonts.sizes.large}
          color={theme.colors.text}
        />
      </AnimatedPressable>

      <PopupModal isOpen={isOpen} onClose={closeMenu}>
        <View style={style.sheetTitle}>
          <FileIcon
            file={file}
            color={style.sheetTitle.color}
            size={style.sheetTitle.fontSize}
          />
          <Text style={style.sheetTitleText}>{file.name}</Text>
        </View>

        <ScrollView>
          <MenuOption
            icon="share"
            label="Share"
            onPress={handleShare}
            theme={theme}
            style={style}
          />

          <MenuOption
            icon="star"
            label={file.starred ? "Remove from Starred" : "Add to Starred"}
            onPress={handleStar}
            theme={theme}
            style={style}
          />

          <MenuOption
            icon="link"
            label="Copy link"
            onPress={handleCopyLink}
            theme={theme}
            style={style}
          />

          {isFile && (
            <MenuOption
              icon="file"
              label="Duplicate"
              onPress={handleDuplicate}
              theme={theme}
              style={style}
            />
          )}

          <MenuOption
            icon="download"
            label="Download"
            onPress={handleDownload}
            theme={theme}
            style={style}
          />

          <MenuOption
            icon="edit"
            label="Rename"
            onPress={handleRenameOpen}
            theme={theme}
            style={style}
          />

          <MenuOption
            icon="folder"
            label="Move"
            onPress={handleMove}
            theme={theme}
            style={style}
          />

          <MenuOption
            icon="trash"
            label="Move to trash"
            onPress={handleTrash}
            theme={theme}
            style={style}
          />
        </ScrollView>
      </PopupModal>

      <InputDialog
        visible={renameVisible}
        onCancel={() => setRenameVisible(false)}
        onConfirm={handleRenameConfirm}
        title="Rename"
        placeholder="New name"
        initialValue={file.name}
        confirmLabel="Rename"
      />
    </>
  );
}

function MenuOption({ icon, label, onPress, theme, style }) {
  return (
    <AnimatedPressable
      style={style.optionItem}
      onPress={onPress}
      backgroundColor={style.optionItem.animBackgroundColor}
      durationIn={style.optionItem.durationIn}
      durationOut={style.optionItem.durationOut}
    >
      <Icon name={icon} size={20} color={theme.colors.text} />
      <Text style={style.optionText}>{label}</Text>
    </AnimatedPressable>
  );
}
