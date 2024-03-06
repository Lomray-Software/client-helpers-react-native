import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Navigation } from 'react-native-navigation';
import type { BottomTabSelectedEvent } from 'react-native-navigation';
import Config from '../../services/config';

/**
 * Listening changing bottom tab navigator selection
 * BottomTabEventListener to reset screenshots when switching tabs
 */
const HandleClickBottomBar = (callback?: (event: BottomTabSelectedEvent) => void): (() => void) => {
  const unsubscribe = Navigation.events().registerBottomTabSelectedListener((...args) => {
    ReactNativeHapticFeedback.trigger('impactMedium', Config.get('hapticFeedbackOptions'));
    callback?.(...args);
  });

  return () => unsubscribe.remove();
};

export default HandleClickBottomBar;
