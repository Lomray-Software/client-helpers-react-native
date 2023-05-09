import type { FCC } from '@lomray/client-helpers/interfaces';
import type { ComponentType, ReactElement } from 'react';
import React from 'react';
// eslint-disable-next-line import/default
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface IPlaceholder {
  isFetching: boolean;
  isFirstRender?: boolean | null;
  count?: number;
  containerStyle?: Animated.AnimateProps<any>['style'];
  PlaceholderComponent?: ReactElement | ComponentType;
}

/**
 * General placeholder
 * 1. Show placeholder while fetching
 * 2. Show component when fetching has done (optional)
 * NOTE: isFirstRender in generally used for flat lists
 * @constructor
 */
const Frame: FCC<IPlaceholder> = ({
  isFetching,
  PlaceholderComponent,
  children,
  containerStyle,
  isFirstRender = null,
  count = 1,
}) => (
  <>
    {(isFirstRender === null || isFirstRender === true) &&
      isFetching &&
      PlaceholderComponent !== undefined && (
        <Animated.View exiting={FadeOut} style={containerStyle}>
          {[...Array(count)].map((_, i) => (
            <React.Fragment key={i}>
              {React.isValidElement(PlaceholderComponent) ? (
                PlaceholderComponent
              ) : (
                <PlaceholderComponent />
              )}
            </React.Fragment>
          ))}
        </Animated.View>
      )}
    {(isFirstRender === false || (isFirstRender === null && !isFetching)) &&
      children !== undefined && (
        <Animated.View entering={FadeIn} style={containerStyle}>
          {children}
        </Animated.View>
      )}
  </>
);

export default Frame;
