import type { FC } from 'react';
import React from 'react';
import { ActivityIndicator } from 'react-native';

interface IFooter {
  hasRows: boolean;
  isFetching: boolean;
}

/**
 * Footer flat list component
 * @constructor
 */
const Footer: FC<IFooter> = ({ hasRows, isFetching }) =>
  isFetching && hasRows ? <ActivityIndicator /> : null;

export default Footer;
