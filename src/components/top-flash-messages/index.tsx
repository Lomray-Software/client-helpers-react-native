import { fs } from '@lomray/react-native-layout-helper';
import type { MessageOptions } from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import type { IConfigParams } from '../../services/config';
import Config from '../../services/config';

const showTopFlashMessage = (msgOptions: MessageOptions): void => {
  const { type = 'info', ...restOptions } = msgOptions;
  const options = Config.get('topFlashMessage', {}) as NonNullable<
    IConfigParams['topFlashMessage']
  >;
  const commonOptions = options?.commonOptions ?? {};
  const typeOptions = options?.[type] ?? {};

  showMessage({
    type,
    position: 'top',
    duration: 5000,
    ...commonOptions,
    ...typeOptions,
    ...restOptions,
    style: [commonOptions?.style, typeOptions?.style, restOptions?.style],
    textStyle: [
      {
        color: '#ffffff',
        fontWeight: '500',
        fontSize: fs(3.733), // 14
      },
      commonOptions?.textStyle,
      typeOptions?.textStyle,
      restOptions?.textStyle,
    ],
    titleStyle: [commonOptions?.titleStyle, typeOptions?.titleStyle, restOptions?.titleStyle],
  });
};

// eslint-disable-next-line import/prefer-default-export
export { showTopFlashMessage, hideMessage };
