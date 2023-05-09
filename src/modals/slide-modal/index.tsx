import type { ReactNode } from 'react';
import React from 'react';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { TouchableOpacity, View, Text } from 'react-native';
import type { NavigationFunctionComponent } from 'react-native-navigation';
import { Navigation } from 'react-native-navigation';
import styles from './styles';

interface ISlideModal {
  title: string;
  textDone?: string;
  titleWrapperStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  doneStyle?: StyleProp<TextStyle>;
  children: ReactNode;
}

/**
 * Custom slide modal component.
 * Show this modal via Navigation.showModal.
 */
const SlideModal: NavigationFunctionComponent<ISlideModal> = ({
  componentId,
  title,
  children,
  titleWrapperStyle,
  titleStyle,
  doneStyle,
  textDone = 'Done',
}) => (
  <View style={styles.container}>
    <View style={[styles.titleWrapper, titleWrapperStyle]}>
      <Text style={[styles.title, titleStyle]} allowFontScaling={false}>
        {title}
      </Text>
      <TouchableOpacity
        onPress={() => void Navigation.dismissModal(componentId)}
        style={styles.doneWrapper}
      >
        <Text style={[styles.done, doneStyle]} allowFontScaling={false}>
          {textDone}
        </Text>
      </TouchableOpacity>
    </View>
    {children}
  </View>
);

export default SlideModal;
