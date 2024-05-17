import type { i18n as Ii18n, Callback, InitOptions, TFunction, Namespace } from 'i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales, findBestLanguageTag } from 'react-native-localize';

export interface ICustomI18n extends Omit<Ii18n, 't'> {
  t: TFunction<Namespace>;
  getSystemLocale: () => string | undefined;
  defaultLanguage: string;
}

const customI18n = i18n as ICustomI18n;

/**
 * Detects what language is installed as default on the device
 */
customI18n.getSystemLocale = (): string => {
  const localeArray = getLocales().map((item) => item.languageCode);
  const language = findBestLanguageTag(localeArray);

  if (!language) {
    return customI18n.defaultLanguage;
  }

  return language.languageTag;
};

const originalInit: (typeof i18n)['init'] = i18n.init.bind(i18n);
const customInit = (options: InitOptions, callback?: Callback): Promise<TFunction> => {
  customI18n.use(initReactI18next);

  return originalInit(
    {
      compatibilityJSON: 'v3',
      load: 'languageOnly',
      fallbackLng: 'en',
      lng: customI18n.defaultLanguage,
      keySeparator: false,
      defaultNS: 'translation',
      ...options,
    },
    callback,
  );
};

customI18n.init = customInit.bind(i18n);

export default customI18n;
