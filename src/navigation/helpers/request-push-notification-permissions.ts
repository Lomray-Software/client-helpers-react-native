import messaging from '@react-native-firebase/messaging';
import Config from '../../services/config';

/**
 * Request IOS Push Notification permissions
 */
const RequestPushNotificationPermission = (): void => {
  const logger = Config.get('logger');

  void messaging()
    .requestPermission()
    .then((authStatus) => {
      const isEnabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      logger?.info(`Push permissions authorization status: ${authStatus} (${String(isEnabled)})`);
    })
    .catch((e) => {
      logger?.error('Request push permissions failed:', e);
    });
};

export default RequestPushNotificationPermission;
