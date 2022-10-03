import type { FC } from 'react';
import React, { useCallback } from 'react';
import type { PressableProps, View, GestureResponderEvent } from 'react-native';
import { Pressable } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Config from '../../services/config';

interface IPressHandler extends Omit<PressableProps, 'onPress'>, React.RefAttributes<View> {
  onPress?: ((event: GestureResponderEvent) => Promise<void>) | PressableProps['onPress'];
}

/**
 * Render press handler component cover
 * @constructor
 */
const PressHandler: FC<IPressHandler> = ({ onPress, disabled, children, ...newProps }) => {
  /**
   * Handle button pressed
   */
  const handleOnPress = useCallback(
    (event: GestureResponderEvent) => {
      ReactNativeHapticFeedback.trigger('impactMedium', Config.get('hapticFeedbackOptions'));

      void onPress?.(event);
    },
    [onPress],
  );

  return (
    <Pressable disabled={disabled} onPress={handleOnPress} {...newProps}>
      {children}
    </Pressable>
  );
};

export default PressHandler;
