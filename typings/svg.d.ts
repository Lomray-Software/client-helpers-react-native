declare module '*.svg' {
  import type { FC } from 'react';
  import type { SvgProps } from 'react-native-svg';

  const value: FC<SvgProps>;
  export default value;
}
