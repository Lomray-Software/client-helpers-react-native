import type { ComponentType } from 'react';
import { Navigation } from 'react-native-navigation';

type TScreens = Map<string, ComponentType | [ComponentType, boolean]>;
type TWrapper = (Component: ComponentType, isEnableGesture?: boolean) => ComponentType;

/**
 * Register application screens
 * @constructor
 */
const RegisterScreens = (screens: TScreens, wrapper: TWrapper) => {
  screens.forEach((Component, componentName) => {
    if (Array.isArray(Component)) {
      return Navigation.registerComponent(componentName, () => wrapper(...Component));
    }

    return Navigation.registerComponent(
      componentName,
      () => wrapper(Component),
      () => Component,
    );
  });
};

export default RegisterScreens;
