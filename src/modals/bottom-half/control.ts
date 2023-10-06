import { Navigation } from 'react-native-navigation';

const OVERLAY_ID = 'overlay.bottom-half';

const openHalfBottom = (screenProps?: Record<any, any>): Promise<string> => {
  const id = screenProps?.id ?? OVERLAY_ID;

  return Navigation.showOverlay({
    component: {
      id,
      name: id,
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
};

const closeHalfBottom = (id = OVERLAY_ID): Promise<string> => Navigation.dismissOverlay(id);

export { OVERLAY_ID, openHalfBottom, closeHalfBottom };
