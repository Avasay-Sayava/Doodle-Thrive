import React, { useRef, useEffect, useMemo } from "react";
import { Text, Animated } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles } from "@/styles/components/drive/tabs/SortButton.styles";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";
import Icon from "@/src/components/common/Icon";

export default function SortButton({ sortOptions, setSortOptions, isEnabled }) {
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const anim = useRef(new Animated.Value(sortOptions.reversed ? 1 : 0)).current;

  const isAnimating = useRef(false);

  useEffect(() => {
    isAnimating.current = true;
    Animated.timing(anim, {
      toValue: sortOptions.reversed ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        isAnimating.current = false;
      }
    });
  }, [sortOptions.reversed]);

  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handlePress = () => {
    if (!isEnabled || isAnimating.current) return;

    setSortOptions((prev) => {
      if (prev.reversed === true) {
        return { by: prev.by, reversed: false };
      } else {
        return { by: prev.by === "name" ? "date" : "name", reversed: true };
      }
    });
  };

  const label = sortOptions.by === "date" ? "Date" : "Name";

  return (
    <AnimatedPressable
      style={style.container}
      onPress={handlePress}
      backgroundColor={isEnabled ? theme.colors.border : "transparent"}
      durationIn={50}
      durationOut={150}
    >
      <Text style={style.text}>{label}</Text>
      {isEnabled && (
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon name="arrow" size={20} color={theme.colors.text} />
        </Animated.View>
      )}
    </AnimatedPressable>
  );
}
