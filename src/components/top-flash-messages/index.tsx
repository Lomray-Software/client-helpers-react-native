import { fs } from '@lomray/react-native-layout-helper';
import type { MessageType } from 'react-native-flash-message';
import { showMessage } from 'react-native-flash-message';
import type { IConfigParams } from '../../services/config';
import Config from '../../services/config';

const showTopFlashMessage = (
  message: string,
  description: string,
  type: MessageType = 'info',
): void => {
  const options = Config.get('topFlashMessage', {}) as NonNullable<
    IConfigParams['topFlashMessage']
  >;
  const commonOptions = options?.commonOptions ?? {};
  const typeOptions = options?.[type] ?? {};

  showMessage({
    message,
    description,
    type,
    position: 'top',
    duration: 5000,
    ...commonOptions,
    ...typeOptions,
    style: [commonOptions?.style, typeOptions?.style],
    textStyle: [
      {
        color: '#ffffff',
        fontWeight: '500',
        fontSize: fs(3.733), // 14
      },
      commonOptions?.textStyle,
      typeOptions?.textStyle,
    ],
    titleStyle: [commonOptions?.titleStyle, typeOptions?.titleStyle],
  });
};

// eslint-disable-next-line import/prefer-default-export
export { showTopFlashMessage };
