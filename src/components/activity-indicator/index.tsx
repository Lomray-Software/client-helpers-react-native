import type { FC } from 'react';
import React from 'react';
import { ActivityIndicator as Indicator, SafeAreaView } from 'react-native';
import styles from './styles';

interface IActivityIndicator {
  isFetching: boolean;
  color?: string;
  size?: 'small' | 'large';
  isTransparent?: boolean;
}

/**
 * Important for this component is a container with "position: relative"
 */
const ActivityIndicator: FC<IActivityIndicator> = ({
  isFetching = false,
  color = '#FFFFFF',
  size = 'large',
  isTransparent = false,
}) => {
  if (!isFetching) {
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.wrapperIndicator, isTransparent && styles.wrapperIndicatorTransparent]}
    >
      <Indicator style={styles.indicator} color={color} size={size} />
    </SafeAreaView>
  );
};

export default ActivityIndicator;
