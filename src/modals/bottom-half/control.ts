import { Navigation } from 'react-native-navigation';

const OVERLAY_ID = 'overlay.bottom-half';

const openHalfBottom = (screenProps?: Record<any, any>): Promise<string> =>
  Navigation.showOverlay({
    component: {
      id: OVERLAY_ID,
      name: OVERLAY_ID,
      passProps: screenProps,
      options: {
        overlay: {
          interceptTouchOutside: false,
          handleKeyboardEvents: false,
        },
        layout: {
          componentBackgroundColor: 'transparent',
        },
      },
    },
  });

const closeHalfBottom = (): Promise<string> => Navigation.dismissOverlay(OVERLAY_ID);

export { OVERLAY_ID, openHalfBottom, closeHalfBottom };
