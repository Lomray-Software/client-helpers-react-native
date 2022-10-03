import type { AppStateStatus } from 'react-native';
import { AppState } from 'react-native';
import Config from '../../services/config';

/**
 * Handle application change state. Foreground/Background.
 */
const HandleAppStateChange = (
  callback: (nextAppState: AppStateStatus) => Promise<void> | void,
): void => {
  AppState.addEventListener('change', (nextAppState) => {
    Config.get('logger')?.info(`App state change: ${nextAppState}.`);
    void callback(nextAppState);
  });
};

export default HandleAppStateChange;
