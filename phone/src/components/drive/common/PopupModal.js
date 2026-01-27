import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Animated,
  PanResponder,
  ScrollView,
  Text,
} from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { styles } from "@/styles/components/drive/common/PopupModal.styles";
import { useOrientation } from "@/src/hooks/common/useOrientation";
import Icon from "@/src/components/common/Icon";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";

const animDuration = 250;

export default function PopupModal({ isOpen, onClose, config }) {
  const orientation = useOrientation();
  useEffect(() => {}, [orientation]);

  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const [visible, setVisible] = useState(false);

  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (isOpen && !visible) {
      openMenu();
    } else if (!isOpen && visible) {
      closeMenu();
    }
  }, [isOpen]);

  const openMenu = () => {
    setVisible(true);
    translateY.setValue(SCREEN_HEIGHT);
    Animated.timing(translateY, {
      toValue: 0,
      duration: animDuration,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = (shouldNotify = false) => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: animDuration,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      if (shouldNotify && onClose) {
        onClose();
      }
    });
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
          closeMenu(true);
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

  const renderTitleIcon = (iconConfig) => {
    if (!iconConfig) {
      return null;
    }

    return (
      <Icon
        name={iconConfig.name}
        size={iconConfig.size ?? style.sheetTitle.fontSize}
        color={iconConfig.color ?? style.sheetTitle.color}
      />
    );
  };

  const renderConfigContent = (modalConfig) => {
    return (
      <>
        {modalConfig.title ? (
          <View style={style.sheetTitle}>
            {renderTitleIcon(modalConfig.title.icon)}
            <Text style={style.sheetTitleText}>{modalConfig.title.text}</Text>
          </View>
        ) : null}
        {(modalConfig.buttons || []).length > 0 ? (
          <ScrollView>
            {(modalConfig.buttons || []).map((button, index) => (
              <AnimatedPressable
                key={button.key ?? `${button.label}-${index}`}
                style={style.optionItem}
                onPress={button.onPress}
                backgroundColor={style.optionItem.animBackgroundColor}
                durationIn={style.optionItem.durationIn}
                durationOut={style.optionItem.durationOut}
              >
                {button.icon ? (
                  <Icon
                    name={button.icon}
                    size={20}
                    color={style.optionText.color}
                  />
                ) : null}
                <Text style={style.optionText}>{button.label}</Text>
              </AnimatedPressable>
            ))}
          </ScrollView>
        ) : null}
      </>
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={() => closeMenu(true)}
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={() => closeMenu(true)}>
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

        <View>{renderConfigContent(config)}</View>
      </Animated.View>
    </Modal>
  );
}
