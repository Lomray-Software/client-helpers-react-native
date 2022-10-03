/* eslint-disable @typescript-eslint/naming-convention */

declare module 'react-native' {
  export interface INavigationBarDimension {
    heightNavbar?: number;
    hasNavbar?: boolean;
    heightWindow?: number;
    heightDisplay?: number;
  }

  export interface NativeModulesStatic {
    CommonModule: {
      getNavigationBarDimension: () => Promise<INavigationBarDimension>;
      minimizeApp: () => void;
      clearBadge?: () => void;
    };
  }
}

export {};
