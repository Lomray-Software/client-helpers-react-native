import type { ReplaceReturnType } from '@lomray/client-helpers/interfaces';
import _ from 'lodash';
import type { ComponentType, ReactElement, Ref } from 'react';
import React, { useCallback, useRef, forwardRef } from 'react';
import type { FlatListProps, ImageSourcePropType } from 'react-native';
import type { AnimatedProps } from 'react-native-reanimated';
import Animated, { LinearTransition, FadeIn } from 'react-native-reanimated';
import Placeholder from '../placeholders/frame';
import Empty from './empty';
import Footer from './footer';

export interface IFlatList<TEntity = Record<string, any>>
  extends AnimatedProps<FlatListProps<TEntity>> {
  hasLayoutAnimation?: boolean;
  emptyListTitle?: string;
  emptyListText?: string;
  emptyListImg?: ImageSourcePropType;
  totalEntities?: number;
  isFetching?: boolean;
  isFirstRender?: boolean;
  placeholderCount?: number;
  placeholderContainerStyle?: AnimatedProps<any>['style'];
  EmptyComponent?: ReactElement | false;
  PlaceholderComponent?: ReactElement | ComponentType;
  onRefresh?:
    | ReplaceReturnType<NonNullable<FlatListProps<TEntity>['onRefresh']>, Promise<any>>
    | FlatListProps<TEntity>['onRefresh'];
  onEndReached?: FlatListProps<TEntity>['onEndReached'];
  onEndReachedAsync?: () => Promise<any>;
}

/**
 * Flat list wrapper
 */
const FlatList = <TEntity, TRef>(
  {
    data,
    EmptyComponent,
    PlaceholderComponent,
    emptyListTitle,
    emptyListText,
    emptyListImg,
    onEndReached,
    onEndReachedAsync,
    placeholderCount,
    placeholderContainerStyle,
    totalEntities = 0,
    hasLayoutAnimation = true,
    isFetching = false,
    isFirstRender = false,
    initialNumToRender = 5,
    ...props
  }: IFlatList<TEntity>,
  ref: Ref<TRef>,
) => {
  const length = data?.['length'] ?? 0;
  const hasRows = length > 0;

  const onEndReachedCalledDuringMomentum = useRef(true);

  /**
   * User touch list (e.g. little scroll)
   * Prevent call onEndReached on first render
   */
  const onMomentumScrollBegin = useCallback(() => {
    onEndReachedCalledDuringMomentum.current = false;
  }, []);

  /**
   * Handle onEndReached
   * Prevent call multiple times
   */
  const onEndReachedThrottled = useCallback(
    _.throttle(
      (params: Parameters<NonNullable<FlatListProps<never>['onEndReached']>>[0]) => {
        if (!onEndReachedCalledDuringMomentum.current && (onEndReached || onEndReachedAsync)) {
          onEndReachedCalledDuringMomentum.current = true;

          if (onEndReachedAsync) {
            void onEndReachedAsync();
          } else if (onEndReached) {
            onEndReached(params);
          }
        }
      },
      1000,
      { trailing: false },
    ),
    [],
  );

  return (
    <>
      <Placeholder
        count={placeholderCount ?? (initialNumToRender as number)}
        isFetching={isFetching}
        isFirstRender={isFirstRender}
        containerStyle={placeholderContainerStyle}
        PlaceholderComponent={PlaceholderComponent}
      />
      {!isFirstRender && (
        <Animated.FlatList
          ref={ref as never}
          data={data}
          refreshing={isFetching}
          initialNumToRender={initialNumToRender}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          {...(hasLayoutAnimation
            ? {
                entering: FadeIn,
                layout: LinearTransition.duration(300),
              }
            : {})}
          onScrollBeginDrag={onMomentumScrollBegin}
          onEndReached={onEndReachedThrottled}
          ListFooterComponent={
            (totalEntities > initialNumToRender && (
              <Footer hasRows={hasRows} isFetching={isFetching} />
            )) ||
            undefined
          }
          ListEmptyComponent={
            EmptyComponent ||
            (EmptyComponent !== false && (
              <Empty
                hasRows={hasRows}
                isFetching={isFetching}
                title={emptyListTitle}
                text={emptyListText}
                Img={emptyListImg}
              />
            )) ||
            undefined
          }
          {...props}
        />
      )}
    </>
  );
};

export default forwardRef(FlatList as never) as <TEntity, TRef>(
  p: IFlatList<TEntity> & { ref?: Ref<TRef> },
) => ReactElement;
