import type { FC } from 'react';
import React from 'react';
import Loader from '../../loader';

interface IFooter {
  hasRows: boolean;
  isFetching: boolean;
}

/**
 * Footer flat list component
 * @constructor
 */
const Footer: FC<IFooter> = ({ hasRows, isFetching }) =>
  isFetching && hasRows ? <Loader /> : null;

export default Footer;
