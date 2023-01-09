import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { Navigation } from 'react-native-navigation';
import { OVERLAY_ID, openHalfBottom } from './control';
import type { IBottomHalfContainer } from './index.container';

export interface IBottomHalf extends Omit<IBottomHalfContainer, 'shouldClose'> {
  isVisible: boolean;
  deps?: boolean | string | Record<string, any>;
}

/**
 * Modal bottom half
 * @constructor
 */
const BottomHalf: FC<IBottomHalf> = ({ isVisible, deps, ...props }) => {
  const isOpened = useRef(false);

  useEffect(() => {
    if (isVisible && !isOpened.current) {
      // Open modal
      isOpened.current = true;
      void openHalfBottom(props);

      return;
    }

    if (!isVisible && isOpened.current) {
      // Close modal
      isOpened.current = false;
      Navigation.updateProps(OVERLAY_ID, {
        shouldClose: true,
      });
    }
  }, [isVisible]);

  /**
   * Re-render components inside modal when deps changed
   */
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    Navigation.updateProps(OVERLAY_ID, props);
  }, [isVisible, deps]);

  return null;
};

export default BottomHalf;
