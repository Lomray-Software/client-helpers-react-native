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
    const { componentId, componentName, componentType } = params;

    if (componentType !== 'Component') {
      return;
    }

    if (hiddenOverlays.includes(componentName)) {
      // Overlay open
      NavigationService.setOverlayInfo(componentId, componentName);
      logger?.info(`View overlay: ${componentName}. Id: ${componentId}`);
      callback?.(EventScreen.overlay, params);

      return;
    }

    if (hiddenModals.includes(componentName)) {
      // Modal change
      NavigationService.setModalInfo(componentId, componentName);
      logger?.info(`View modal: ${componentName}. Id: ${componentId}`);
      callback?.(EventScreen.modal, params);

      return;
    }

    // Screen change (push)
    NavigationService.setComponentInfo(componentId, componentName);
    logger?.info(`View screen: ${componentName}. Id: ${componentId}`);
    callback?.(EventScreen.screen, params);
  });

  Navigation.events().registerComponentDidDisappearListener(({ componentId, componentName }) => {
    // Overlay close
    if (hiddenOverlays.includes(componentName)) {
      NavigationService.closeOverlay(componentId, componentName);
    }
  });

  Navigation.events().registerModalDismissedListener(() => {
    // Modal close
    NavigationService.closeModal();
  });

  Navigation.events().registerBottomTabSelectedListener(
    ({ selectedTabIndex, unselectedTabIndex }) => {
      NavigationService.setBottomTabInfo(selectedTabIndex, unselectedTabIndex);
    },
  );
};

export { EventScreen, HandleChangeScreen };
