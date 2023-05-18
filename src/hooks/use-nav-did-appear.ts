import { useEffect, useRef } from 'react';
import type { ComponentDidAppearEvent } from 'react-native-navigation';
import { Navigation } from 'react-native-navigation';

type THandler = (event: ComponentDidAppearEvent) => any;

type TOptions = { isRepeat?: boolean } & ({ componentId: string } | { componentName: string });

/**
 * Called each time when component appears on screen (attached to the view hierarchy)
 */
const useNavDidAppear = (handler: THandler, options: TOptions) => {
  const disappearCallback = useRef<THandler>();
  const onceAppearFired = useRef(false);

  const { isRepeat = false } = options;

  /**
   * Did appear
   */
  useEffect(() => {
    const subscription = Navigation.events().registerComponentDidAppearListener(
      (event: ComponentDidAppearEvent) => {
        const { componentId, componentName } = event;

        if (
          ('componentId' in options && options.componentId !== componentId) ||
          ('componentName' in options && options.componentName !== componentName)
        ) {
          return;
        }

        if (!isRepeat && onceAppearFired.current) {
          return;
        }

        disappearCallback.current = handler(event);
        onceAppearFired.current = true;
      },
    );

    return () => subscription.remove();
  }, [handler, options]);

  /**
   * Did disappear
   */
  useEffect(() => {
    const subscription = Navigation.events().registerComponentDidDisappearListener(
      (event: ComponentDidAppearEvent) => {
        const { componentId, componentName } = event;

        if (
          ('componentId' in options && options.componentId !== componentId) ||
          ('componentName' in options && options.componentName !== componentName)
        ) {
          return;
        }

        disappearCallback.current?.(event);

        if (!isRepeat && disappearCallback.current) {
          disappearCallback.current = undefined;
        }
      },
    );

    return () => subscription.remove();
  }, [handler, options]);
};

export default useNavDidAppear;
