import type { FC } from 'react';
import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { ImageBackground, View, Text } from 'react-native';
import styles from './styles';

interface IEmpty {
  hasRows: boolean;
  isFetching: boolean;
  title?: string;
  text?: string;
  Img?: ImageSourcePropType;
}

/**
 * Empty flat list component
 * @constructor
 */
const Empty: FC<IEmpty> = ({ hasRows, isFetching, title, text, Img }) =>
  (!hasRows && !isFetching && (
    <View style={styles.emptyBlock}>
      {Img && <ImageBackground source={Img} style={styles.background} resizeMode="cover" />}
      {title && <Text style={styles.noFoundTitle}>{title}</Text>}
      {text && <Text style={styles.noFoundText}>{text}</Text>}
    </View>
  )) ||
  null;

export default Empty;
