import { NativeModules } from 'react-native';
import { isAndroid } from './platform';

/**
 * Get navigation bar dimension on android
 * NOTE: only android
 */
const getNavigationBarDimension = (): ReturnType<
  (typeof NativeModules)['CommonModule']['getNavigationBarDimension']
> => {
  if (!isAndroid()) {
    return Promise.resolve({});
  }

  return NativeModules.CommonModule?.getNavigationBarDimension();
};

export default getNavigationBarDimension;
