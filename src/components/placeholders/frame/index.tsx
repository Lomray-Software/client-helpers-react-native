import type { ComponentType, FC, ReactElement } from 'react';
import React from 'react';
// eslint-disable-next-line import/default
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface IPlaceholder {
  isFetching: boolean;
  isFirstRender?: boolean | null;
  count?: number;
  PlaceholderComponent?: ReactElement | ComponentType;
}

/**
 * General placeholder
 * 1. Show placeholder while fetching
 * 2. Show component when fetching has done (optional)
 * NOTE: isFirstRender in generally used for flat lists
 * @constructor
 */
const Frame: FC<IPlaceholder> = ({
  isFetching,
  PlaceholderComponent,
  children,
  isFirstRender = null,
  count = 1,
}) => (
  <>
    {(isFirstRender === null || isFirstRender === true) &&
      isFetching &&
      PlaceholderComponent !== undefined && (
        <Animated.View exiting={FadeOut}>
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
      children !== undefined && <Animated.View entering={FadeIn}>{children}</Animated.View>}
  </>
);

export default Frame;
