import _ from 'lodash';
import { Alert, Linking } from 'react-native';
import { showTopFlashMessage } from '../components/top-flash-messages';
import Config from '../services/config';
import i18n from '../services/localization';
import VersionCheck from '../services/version-check';

/**
 * Check app version and show dialog for update
 */
const checkNewVersion = _.debounce(
  () => {
    const isDev = Config.get('isLocalDevelopment');
    const packageName = Config.get('packageName');
    const logger = Config.get('logger');

    if (isDev || !packageName) {
      return;
    }

    VersionCheck.init({ bundleId: packageName })
      .needUpdate()
      .then(({ hasUpdate, storeUrl }) => {
        if (!hasUpdate) {
          return;
        }

        Alert.alert(
          i18n.t('translation:alertTitle'),
          i18n.t('translation:alertMessage'),
          [
            {
              text: i18n.t('translation:cancel'),
              style: 'cancel',
            },
            {
              text: i18n.t('translation:update'),
              onPress: () => {
                Linking.canOpenURL(storeUrl).then(
                  (supported) => {
                    supported && Linking.openURL(storeUrl);
                  },
                  (err) => showTopFlashMessage(i18n.t('translation:error'), err as string, 'error'),
                );
              },
            },
          ],
          { cancelable: false },
        );
      })
      .catch((e) => {
        logger?.error('Failed check store version #1: ', e);
      });
  },
  30000,
  {
    leading: true,
    trailing: false,
  },
);

export default checkNewVersion;
