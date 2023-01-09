import type { FC } from 'react';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

interface IEmpty {
  hasRows: boolean;
  isFetching: boolean;
}

/**
 * Empty flat list component
 * @constructor
 */
const Empty: FC<IEmpty> = ({ hasRows, isFetching }) =>
  (!hasRows && !isFetching && <View style={styles.emptyBlock} />) || null;

export default Empty;
