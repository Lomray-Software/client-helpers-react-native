import { Platform } from 'react-native';

/**
 * Running on iOS
 */
const isIOS = (): boolean => Platform.OS === 'ios';

/**
 * Running on Android
 */
const isAndroid = (): boolean => Platform.OS === 'android';

export { isAndroid, isIOS };
