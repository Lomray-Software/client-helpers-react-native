import _ from 'lodash';
import type { AlertButton } from 'react-native';
import { Alert, Linking } from 'react-native';
import { showTopFlashMessage } from '../components/top-flash-messages';
import Config from '../services/config';
import i18n from '../services/localization';
import VersionCheck from '../services/version-check';

interface ICheckNewVersion {
  isMandatoryUpdate: boolean;
  countryCode: string;
}

/**
 * Check app version and show dialog for update
 */
const checkNewVersion = _.debounce(
  (params?: ICheckNewVersion): void => {
    const { countryCode = 'us', isMandatoryUpdate = false } = params ?? {};

    const isDev = !Config.get('isProdDeployment');
    const packageName = Config.get('packageName');
    const logger = Config.get('logger');

    if (isDev || !packageName) {
      return;
    }

    VersionCheck.init({ bundleId: packageName, countryCode })
      .needUpdate()
      .then(({ hasUpdate, storeUrl }) => {
        if (!hasUpdate) {
          return;
        }

        const buttons: AlertButton[] = [
          {
            text: i18n.t('translation:cancel'),
            style: 'cancel',
          },
          {
            text: i18n.t('translation:update'),
            onPress: () => {
              Linking.canOpenURL(storeUrl).then(
                (supported) => {
                  if (!supported) {
                    return;
                  }

                  void Linking.openURL(storeUrl);
                },
                (err) =>
                  showTopFlashMessage({
                    message: i18n.t('translation:error'),
                    description: err,
                    type: 'danger',
                  }),
              );
            },
          },
        ];

        Alert.alert(
          i18n.t('translation:alertTitle'),
          i18n.t('translation:alertMessage'),
          isMandatoryUpdate ? [buttons[1]] : buttons,
          {
            cancelable: false,
          },
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
