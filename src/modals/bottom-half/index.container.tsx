import type { FCC } from '@lomray/client-helpers/interfaces';
import React, { useCallback, useEffect, useRef } from 'react';
import type { ViewProps } from 'react-native';
import { Animated, Dimensions, PanResponder, View } from 'react-native';
import PressHandler from '../../components/press-handler';
import { closeHalfBottom } from './control';
import styles from './styles';

export interface IBottomHalfContainer {
  id?: string;
  onClose?: () => void;
  height?: number | string;
  shouldClose?: boolean;
  hasControlButton?: boolean;
  containerStyle?: ViewProps['style'];
  pressHandlerStyle?: ViewProps['style'];
  dropdownStyle?: ViewProps['style'];
  controlButtonContainerStyle?: ViewProps['style'];
  controlButtonStyle?: ViewProps['style'];
}

/**
 * Animation time setting
 */
const CLOSING_TIME = 200;
const STEP_BOUNCE_TIME = 150;
const OPENING_BACKGROUND_TIME = 300;

/**
 * Modal container
 * @constructor
 */
const BottomHalfContainer: FCC<IBottomHalfContainer> = ({
  id,
  children,
  height, // default width equals content size
  onClose,
  containerStyle,
  dropdownStyle,
  pressHandlerStyle,
  controlButtonContainerStyle,
  controlButtonStyle,
  hasControlButton = true,
  shouldClose = false,
}) => {
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /**
   * Bounce effect setting
   */
  const resetPositionAnim = () =>
    Animated.sequence([
      Animated.timing(panY, {
        toValue: 0,
        duration: STEP_BOUNCE_TIME,
        useNativeDriver: true,
      }),
      Animated.timing(panY, {
        toValue: 20,
        duration: STEP_BOUNCE_TIME,
        useNativeDriver: true,
      }),
      Animated.timing(panY, {
        toValue: 0,
        duration: STEP_BOUNCE_TIME,
        useNativeDriver: true,
      }),
    ]).start();

  /**
   * Opacity of the effect when opening the modal
   */
  const openAnim = Animated.timing(fadeAnim, {
    toValue: 1,
    duration: OPENING_BACKGROUND_TIME,
    useNativeDriver: true,
  });

  const closeAnim = () => {
    Animated.parallel([
      Animated.timing(panY, {
        toValue: 700,
        duration: CLOSING_TIME,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: CLOSING_TIME,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  /**
   * Close modal by clicking on overlay
   */
  const handleDismiss = useCallback(() => {
    closeAnim();
    setTimeout(() => {
      void closeHalfBottom(id);
      onClose?.();
    }, CLOSING_TIME);
  }, [closeAnim]);

  /**
   * Show modal
   */
  useEffect(() => {
    resetPositionAnim();
    openAnim.start();
  }, []);

  /**
   * Close modal
   */
  useEffect(() => {
    if (!shouldClose) {
      return;
    }

    handleDismiss();
  }, [shouldClose]);

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 0 && gs.vy > 1) {
          return onClose?.();
        }

        return resetPositionAnim();
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <PressHandler style={[styles.wrapper, pressHandlerStyle]} onPress={onClose} />
      <Animated.View
        style={[
          { ...styles.dropdown, transform: [{ translateY }] },
          dropdownStyle,
          (height && { height }) || undefined,
        ]}
      >
        {hasControlButton && (
          <Animated.View
            {...panResponders.panHandlers}
            style={[styles.controlButtonBlock, controlButtonContainerStyle]}
          >
            <View style={[styles.controlButton, controlButtonStyle]} />
          </Animated.View>
        )}
        {children}
      </Animated.View>
    </Animated.View>
  );
};

export default BottomHalfContainer;
