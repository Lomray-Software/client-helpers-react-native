import type { FCC } from '@lomray/client-helpers/interfaces';
import { useEffect, useRef } from 'react';
import { Navigation } from 'react-native-navigation';
import { OVERLAY_ID, openHalfBottom } from './control';
import type { IBottomHalfContainer } from './index.container';

export interface IBottomHalf extends Omit<IBottomHalfContainer, 'shouldClose'> {
  isVisible: boolean;
  id?: string; // custom overlay id
  deps?: boolean | string | Record<string, any>;
}

/**
 * Modal bottom half
 * @constructor
 */
const BottomHalf: FCC<IBottomHalf> = ({ isVisible, deps, ...props }) => {
  const isOpened = useRef(false);
  const { id = OVERLAY_ID } = props;

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
      Navigation.updateProps(id, {
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

    Navigation.updateProps(id, props);
  }, [isVisible, deps]);

  return null;
};

export default BottomHalf;
