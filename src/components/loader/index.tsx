import type { FC } from 'react';
import React from 'react';
import type { ActivityIndicatorProps } from 'react-native';
import { ActivityIndicator } from 'react-native';
import Config from '../../services/config';

const Loader: FC<ActivityIndicatorProps> = (props) => {
  const color = props.color ?? Config.get('indicators')?.loader?.color;

  return <ActivityIndicator color={color} {...props} />;
};

export default Loader;
