import React, { useEffect, useRef, useMemo } from "react";
import { Pressable, View, Animated, StyleSheet } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles } from "@/styles/components/drive/tabs/ChooseViewMode.styles";
import Icon from "@/src/components/common/Icon.js";

const SIZE = 20;
const CONTAINER_WIDTH = 96;
const CONTAINER_HEIGHT = 36;
const SLIDER_PADDING = 4;
const SLIDER_WIDTH = (CONTAINER_WIDTH - 3 * SLIDER_PADDING) / 2;
const SLIDER_HEIGHT = CONTAINER_HEIGHT - 2 * SLIDER_PADDING;
const animDuration = 150;

export default function ChooseViewMode({ viewMode, setViewMode }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const anim = useRef(new Animated.Value(viewMode === "list" ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: viewMode === "list" ? 0 : 1,
      duration: animDuration,
      useNativeDriver: true,
    }).start();
  }, [viewMode]);

  const toggle = () => {
    setViewMode((prev) => (prev === "list" ? "grid" : "list"));
  };

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SLIDER_WIDTH + SLIDER_PADDING],
  });

  return (
    <Pressable
      style={[
        style.container,
        { width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT },
      ]}
      onPress={toggle}
    >
      <Animated.View
        style={[
          style.slider,
          {
            left: SLIDER_PADDING,
            width: SLIDER_WIDTH,
            top: SLIDER_PADDING,
            height: SLIDER_HEIGHT,
            transform: [{ translateX }],
          },
        ]}
      />
      <View
        style={[
          style.iconsContainer,
          { paddingHorizontal: SLIDER_PADDING, gap: SLIDER_PADDING },
        ]}
      >
        <IconWrapper name="list" anim={anim} target={0} />
        <IconWrapper name="grid" anim={anim} target={1} />
      </View>
    </Pressable>
  );
}

function IconWrapper({ name, anim, target }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const activeOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: target === 0 ? [1, 0] : [0, 1],
  });

  const inactiveOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: target === 0 ? [0, 1] : [1, 0],
  });

  return (
    <View style={style.center}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: "center",
            justifyContent: "center",
            opacity: inactiveOpacity,
          },
        ]}
      >
        <Icon name={name} size={SIZE} color={theme.colors.textMuted} />
      </Animated.View>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: "center",
            justifyContent: "center",
            opacity: activeOpacity,
          },
        ]}
      >
        <Icon name={name} size={SIZE} color={theme.colors.text} />
      </Animated.View>
    </View>
  );
}
