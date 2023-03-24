import messaging from '@react-native-firebase/messaging';
import Config from '../../services/config';

/**
 * Request IOS Push Notification permissions
 */
const RequestPushNotificationPermission = (): Promise<boolean> => {
  const logger = Config.get('logger');

  return messaging()
    .requestPermission()
    .then((authStatus) => {
      const isEnabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL ||
        authStatus === messaging.AuthorizationStatus.EPHEMERAL;

      logger?.info(`Push permissions authorization status: ${authStatus} (${String(isEnabled)})`);

      return isEnabled;
    })
    .catch((e) => {
      logger?.error('Request push permissions failed:', e);

      return false;
    });
};

export default RequestPushNotificationPermission;
