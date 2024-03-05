import type { FCC } from '@lomray/client-helpers/interfaces';
import type { ReactNode } from 'react';
import React from 'react';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { TouchableOpacity, View, Text } from 'react-native';
import type { TextProps } from 'react-native/Libraries/Text/Text';
import styles from './styles';

interface ISlideModal {
  title: string;
  textDone?: string;
  textProps?: TextProps;
  titleProps?: TextProps;
  titleWrapperStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  doneStyle?: StyleProp<TextStyle>;
  onClose: () => Promise<void> | void;
  children: ReactNode;
}

/**
 * Custom slide modal component.
 * Show this modal via Navigation.showModal.
 */
const SlideModal: FCC<ISlideModal> = ({
  title,
  children,
  titleWrapperStyle,
  titleStyle,
  textProps,
  titleProps,
  doneStyle,
  onClose,
  textDone = 'Done',
}) => (
  <View style={styles.container}>
    <View style={[styles.titleWrapper, titleWrapperStyle]}>
      <Text style={[styles.title, titleStyle]} allowFontScaling={false} {...titleProps}>
        {title}
      </Text>
      <TouchableOpacity onPress={() => void onClose()} style={styles.doneWrapper}>
        <Text style={[styles.done, doneStyle]} allowFontScaling={false} {...textProps}>
          {textDone}
        </Text>
      </TouchableOpacity>
    </View>
    {children}
  </View>
);

export default SlideModal;
