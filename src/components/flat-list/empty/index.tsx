import type { FC } from 'react';
import React from 'react';
import type { ImageSourcePropType, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ImageBackground, View, Text } from 'react-native';
import styles from './styles';

interface IEmpty {
  hasRows: boolean;
  isFetching: boolean;
  title?: string;
  text?: string;
  Img?: ImageSourcePropType;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Empty flat list component
 * @constructor
 */
const Empty: FC<IEmpty> = ({
  hasRows,
  isFetching,
  title,
  text,
  Img,
  containerStyle,
  imageStyle,
  titleStyle,
  textStyle,
}) =>
  (!hasRows && !isFetching && (
    <View style={[styles.emptyBlock, containerStyle]}>
      {Img && (
        <ImageBackground source={Img} style={[styles.background, imageStyle]} resizeMode="cover" />
      )}
      {title && <Text style={[styles.noFoundTitle, titleStyle]}>{title}</Text>}
      {text && <Text style={[styles.noFoundText, textStyle]}>{text}</Text>}
    </View>
  )) ||
  null;

export default Empty;
