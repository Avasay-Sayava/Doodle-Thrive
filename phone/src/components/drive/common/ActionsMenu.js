import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Animated,
  PanResponder,
  ScrollView,
  Clipboard,
} from "react-native";
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

const animDuration = 250;

export default function ActionsMenu({ file }) {
  const orientation = useOrientation();
  useEffect(() => {}, [orientation]);

  const { refreshAll } = useFilesRefresh();
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);

  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const { star, trash, duplicate, rename } = useFilesActions();

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const triggerRefresh = () => {
    refreshAll();
  };

  const openMenu = () => {
    setVisible(true);
    translateY.setValue(SCREEN_HEIGHT);
    Animated.timing(translateY, {
      toValue: 0,
      duration: animDuration,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: animDuration,
      useNativeDriver: true,
    }).start(() => setVisible(false));
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
    setVisible(false);
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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SCREEN_HEIGHT / 8 || gestureState.vy > 0.8) {
          closeMenu();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: animDuration,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const backdropOpacity = translateY.interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

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

      <Modal
        transparent={true}
        visible={visible}
        onRequestClose={closeMenu}
        animationType="none"
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <Animated.View
            style={[style.modalOverlay, { opacity: backdropOpacity }]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            style.modalContent,
            { transform: [{ translateY }], maxHeight: SCREEN_HEIGHT - 100 },
          ]}
        >
          <View {...panResponder.panHandlers} style={style.handleContainer}>
            <View style={style.dragHandle} />
          </View>

          <View style={style.sheetTitle}>
            <FileIcon
              file={file}
              color={style.sheetTitle.color}
              size={style.sheetTitle.fontSize}
            />
            <Text style={style.sheetTitleText}>
              {file.name}
            </Text>
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
        </Animated.View>
      </Modal>

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
