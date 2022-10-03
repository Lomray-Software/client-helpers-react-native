import { isAndroid } from '@lomray/react-native-layout-helper';
import _ from 'lodash';
import { BackHandler, NativeModules, ToastAndroid } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Navigation } from 'react-native-navigation';
import Config from '../../services/config';
import i18n from '../../services/localization';

/**
 * Listen back button on android and wait click twice to exit from app.
 * If user can't pop screen.
 *
 * #### (Android specific)
 *
 * NOTE: Wait popScreenDuration and if resetTimer is not called (screen is not popped) then show toast.
 */
const HandleBackButtonAndroid = (): void => {
  if (!isAndroid) {
    return;
  }

  const hapticOptions = Config.get('hapticFeedbackOptions');
  const popScreenDuration = 400;
  const { CommonModule } = NativeModules;
  let timerShowToast: NodeJS.Timeout | undefined;
  let timerExitAppWindow: NodeJS.Timeout | undefined;

  const resetTimer = () => {
    clearTimeout(timerShowToast);
    clearTimeout(timerExitAppWindow);
    timerShowToast = undefined;
  };

  const backHandler: () => boolean = _.debounce(
    () => {
      ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);

      if (timerShowToast) {
        resetTimer();
        CommonModule.minimizeApp();

        return true;
      }

      timerShowToast = setTimeout(() => {
        ToastAndroid.show(i18n.t('translation:exitApp'), ToastAndroid.SHORT);
        timerExitAppWindow = setTimeout(() => resetTimer(), 2000); // short toast duration
      }, popScreenDuration);

      return false;
    },
    popScreenDuration + 100,
    {
      leading: true,
      trailing: false,
    },
  );

  Navigation.events().registerScreenPoppedListener(resetTimer);
  Navigation.events().registerModalDismissedListener(resetTimer);
  BackHandler.addEventListener('hardwareBackPress', backHandler);
};

export default HandleBackButtonAndroid;
