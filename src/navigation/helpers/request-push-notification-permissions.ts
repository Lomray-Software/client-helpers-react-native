import messaging from '@react-native-firebase/messaging';
import Config from '../../services/config';

/**
 * Request IOS Push Notification permissions
 */
const RequestPushNotificationPermission = async (): Promise<boolean> => {
  const logger = Config.get('logger');

  try {
    const authStatus = await messaging().requestPermission();
    const isEnabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL ||
      authStatus === messaging.AuthorizationStatus.EPHEMERAL;

    logger?.info(`Push permissions authorization status: ${authStatus} (${String(isEnabled)})`);

    return isEnabled;
  } catch (e) {
    logger?.error('Request push permissions failed:', e);

    return false;
  }
};

export default RequestPushNotificationPermission;
