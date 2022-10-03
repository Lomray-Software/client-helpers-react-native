import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Navigation } from 'react-native-navigation';
import type { BottomTabSelectedEvent } from 'react-native-navigation';
import Config from '../../services/config';
import NavigationService from '../../services/navigation';

/**
 * Listening changing bottom tab navigator selection
 * BottomTabEventListener to reset screenshots when switching tabs
 */
const HandleChangeBottomBar = (callback: (event: BottomTabSelectedEvent) => void): void => {
  Navigation.events().registerBottomTabSelectedListener((...args) => {
    ReactNativeHapticFeedback.trigger('impactMedium', Config.get('hapticFeedbackOptions'));
    void Navigation.popToRoot(NavigationService.getComponentId());
    callback(...args);
  });
};

export default HandleChangeBottomBar;
