import { isAndroid } from '@lomray/react-native-layout-helper';
import { NativeModules } from 'react-native';

/**
 * Get navigation bar dimension on android
 * NOTE: only android
 */
const getNavigationBarDimension = (): ReturnType<
  typeof NativeModules['CommonModule']['getNavigationBarDimension']
> => {
  if (!isAndroid) {
    return Promise.resolve({});
  }

  return NativeModules.CommonModule?.getNavigationBarDimension();
};

export default getNavigationBarDimension;
