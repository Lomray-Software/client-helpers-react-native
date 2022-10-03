import NetInfo from '@react-native-community/netinfo';
import { showTopFlashMessage } from '../../components/top-flash-messages';
import Config from '../../services/config';
import i18n from '../../services/localization';

/**
 * Listening changing internet connection state
 */
const HandleChangeInternetConnection = (): void => {
  NetInfo.addEventListener((state) => {
    if (!state.isConnected) {
      Config.get('logger')?.info('No internet connection');
      showTopFlashMessage(
        i18n.t('translation:noConnection'),
        i18n.t('translation:checkConnection'),
      );
    }
  });
};

export default HandleChangeInternetConnection;
