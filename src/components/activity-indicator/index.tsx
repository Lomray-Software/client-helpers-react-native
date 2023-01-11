import type { FC } from 'react';
import React from 'react';
import { ActivityIndicator as Indicator, SafeAreaView } from 'react-native';
import Config from '../../services/config';
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
  color,
  size = 'large',
  isTransparent = false,
}) => {
  if (!isFetching) {
    return null;
  }

  const usedColor = color ?? Config.get('indicators')?.activity?.color;

  return (
    <SafeAreaView
      style={[styles.wrapperIndicator, isTransparent && styles.wrapperIndicatorTransparent]}
    >
      <Indicator style={styles.indicator} color={usedColor} size={size} />
    </SafeAreaView>
  );
};

export default ActivityIndicator;
