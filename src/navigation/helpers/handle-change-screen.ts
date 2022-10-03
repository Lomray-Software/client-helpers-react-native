import { Navigation } from 'react-native-navigation';
import type { ComponentDidAppearEvent } from 'react-native-navigation';
import Config from '../../services/config';
import NavigationService from '../../services/navigation';

enum EventScreen {
  overlay = 'overlay',
  modal = 'modal',
  screen = 'screen',
}

interface IHandleChangeScreen {
  hiddenOverlays: string[];
  hiddenModals: string[];
  callback?: (event: EventScreen, params: ComponentDidAppearEvent) => void;
}

/**
 * Handle screen change
 */
const HandleChangeScreen = ({
  hiddenOverlays,
  hiddenModals,
  callback,
}: IHandleChangeScreen): void => {
  const logger = Config.get('logger');

  Navigation.events().registerComponentDidAppearListener((params) => {
    const { componentId, componentName } = params;

    if (hiddenOverlays.includes(componentName)) {
      // Overlay change
      logger?.info(`View overlay: ${componentName}. Id: ${componentId}`);
      callback?.(EventScreen.overlay, params);

      return;
    }

    if (hiddenModals.includes(componentName)) {
      // Modal change
      logger?.info(`View modal: ${componentName}. Id: ${componentId}`);
      callback?.(EventScreen.modal, params);

      return;
    }

    // Screen change (push)
    NavigationService.setComponentId(componentId);
    logger?.info(`View screen: ${componentName}. Id: ${componentId}`);
    callback?.(EventScreen.screen, params);
  });
};

export { EventScreen, HandleChangeScreen };
