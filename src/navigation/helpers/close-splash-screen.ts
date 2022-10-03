import SplashScreen from 'react-native-mixed-splash';
import { Navigation } from 'react-native-navigation';
import Config from '../../services/config';

const CloseSplashScreen = (hiddenOverlays: string[]): void => {
  const isLocalDevelopment = Config.get('isLocalDevelopment');

  // When reload bundle, this will work (with did appear listener not working)
  if (isLocalDevelopment) {
    SplashScreen.hide({ fade: true });

    return;
  }

  // Only for production
  const sub = Navigation.events().registerComponentDidAppearListener((props) => {
    // Skip overlay registration
    if (hiddenOverlays.includes(props.componentName)) {
      return;
    }

    SplashScreen.hide({ fade: true });
    sub.remove();
  });
};

export default CloseSplashScreen;
