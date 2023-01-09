import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import type { NavigationFunctionComponent } from 'react-native-navigation';
import { Navigation } from 'react-native-navigation';
import styles from './styles';

interface ISlideModal {
  title: string;
  textDone?: string;
}

/**
 * Custom slide modal component.
 * Show this modal via Navigation.showModal.
 */
const SlideModal: NavigationFunctionComponent<ISlideModal> = ({
  componentId,
  title,
  children,
  textDone = 'Done',
}) => (
  <View style={styles.container}>
    <View style={styles.titleWrapper}>
      <Text style={styles.title} allowFontScaling={false}>
        {title}
      </Text>
      <TouchableOpacity
        onPress={() => void Navigation.dismissModal(componentId)}
        style={styles.doneWrapper}
      >
        <Text style={styles.done} allowFontScaling={false}>
          {textDone}
        </Text>
      </TouchableOpacity>
    </View>
    {children}
  </View>
);

export default SlideModal;
