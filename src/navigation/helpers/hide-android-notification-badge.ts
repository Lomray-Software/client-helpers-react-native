import { isAndroid } from '@lomray/react-native-layout-helper';
import { NativeModules } from 'react-native';

/**
 * Hide notification badge in android
 */
const HideAndroidNotificationBadge = (): void => {
  if (!isAndroid) {
    return;
  }

  const { CommonModule } = NativeModules;

  CommonModule?.clearBadge?.();
};

export default HideAndroidNotificationBadge;
