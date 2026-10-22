import { NativeModules } from 'react-native';
import { isAndroid } from '../../helpers/platform';

/**
 * Hide notification badge in android
 */
const HideAndroidNotificationBadge = (): void => {
  if (!isAndroid()) {
    return;
  }

  const { CommonModule } = NativeModules;

  CommonModule?.clearBadge?.();
};

export default HideAndroidNotificationBadge;
