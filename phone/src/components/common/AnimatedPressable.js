import React, { useRef } from "react";
import { Pressable, Animated, StyleSheet } from "react-native";

export default function AnimatedPressable({
  children,
  style,
  onPress,
  onPressIn,
  onPressOut,
  duration,
  durationIn = duration,
  durationOut = duration,
  backgroundColor,
  ...props
}) {
  const opacity = useRef(new Animated.Value(0)).current;

  const isPressed = useRef(false);
  const isAnimatingIn = useRef(false);

  const animateIn = () => {
    isPressed.current = true;
    if (isAnimatingIn.current) return;
    isAnimatingIn.current = true;

    Animated.timing(opacity, {
      toValue: 1,
      duration: durationIn,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        isAnimatingIn.current = false;
        if (!isPressed.current) {
          animateOut();
        }
      }
    });

    if (onPressIn) onPressIn();
  };

  const animateOut = () => {
    isPressed.current = false;

    if (isAnimatingIn.current) return;

    Animated.timing(opacity, {
      toValue: 0,
      duration: durationOut,
      useNativeDriver: true,
    }).start();

    if (onPressOut) onPressOut();
  };

  const flatStyle = StyleSheet.flatten(style) || {};
  const {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
  } = flatStyle;

  return (
    <Pressable
      {...props}
      onPress={onPress}
      onPressIn={animateIn}
      onPressOut={animateOut}
      style={style}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor,
            opacity,
            borderRadius,
            borderTopLeftRadius,
            borderTopRightRadius,
            borderBottomLeftRadius,
            borderBottomRightRadius,
          },
        ]}
      />
      {children}
    </Pressable>
  );
}
