import type { FCC } from '@lomray/client-helpers/interfaces';
import { fs } from '@lomray/react-native-layout-helper';
import React from 'react';
import { View } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import type { IConfigParams } from '../../services/config';
import Config from '../../services/config';

const TopFlashMessages: FCC = () => (
  <View>
    <FlashMessage position="top" />
  </View>
);

const showTopFlashMessage = (
  message: string,
  description: string,
  type: 'error' | 'success' | 'info' = 'info',
): void => {
  const { colors, options = {} } = Config.get('topFlashMessage', {}) as NonNullable<
    IConfigParams['topFlashMessage']
  >;
  const backgroundColor = colors?.[type];

  showMessage({
    message,
    description,
    duration: 5000,
    backgroundColor,
    textStyle: {
      fontWeight: '500',
      fontSize: fs(3.733), // 14
      color: colors?.text,
    },
    ...options,
  });
};

export { TopFlashMessages, showTopFlashMessage };
