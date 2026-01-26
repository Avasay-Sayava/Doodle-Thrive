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
} from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles } from "@/styles/components/drive/common/ActionsMenu.styles";
import Icon from "@/src/components/common/Icon";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";
import { useOrientation } from "@/src/hooks/common/useOrientation";

const animDuration = 250;

export default function ActionsMenu({ file }) {
  const orientation = useOrientation();
  useEffect(() => {}, [orientation]);

  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

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

          <Text style={style.sheetTitle}>{file?.name || "File Options"}</Text>

          <ScrollView>
            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={style.optionItem}
              backgroundColor={style.optionItem.animBackgroundColor}
              durationIn={style.optionItem.durationIn}
              durationOut={style.optionItem.durationOut}
            >
              <Icon name="shared" size={20} color={theme.colors.text} />
              <Text style={style.optionText}>Share</Text>
            </AnimatedPressable>
          </ScrollView>
        </Animated.View>
      </Modal>
    </>
  );
}
