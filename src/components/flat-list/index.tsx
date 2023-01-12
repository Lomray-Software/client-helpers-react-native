import type { ReplaceReturnType } from '@lomray/client-helpers/interfaces';
import _ from 'lodash';
import type { ComponentType, ReactElement } from 'react';
import React, { useCallback, useRef } from 'react';
import type { FlatListProps, ImageSourcePropType } from 'react-native';
import type { AnimateProps } from 'react-native-reanimated';
// eslint-disable-next-line import/default
import Animated, { Layout, FadeIn } from 'react-native-reanimated';
import Placeholder from '../placeholders/frame';
import Empty from './empty';
import Footer from './footer';

export interface IFlatList<TEntity = Record<string, any>>
  extends AnimateProps<FlatListProps<TEntity>> {
  emptyListTitle?: string;
  emptyListText?: string;
  emptyListImg?: ImageSourcePropType;
  totalEntities?: number;
  isFetching?: boolean;
  isFirstRender?: boolean;
  EmptyComponent?: ReactElement | false;
  PlaceholderComponent?: ReactElement | ComponentType;
  onRefresh?:
    | ReplaceReturnType<NonNullable<FlatListProps<TEntity>['onRefresh']>, Promise<void>>
    | FlatListProps<TEntity>['onRefresh'];
  onEndReached?:
    | ReplaceReturnType<NonNullable<FlatListProps<TEntity>['onEndReached']>, Promise<void>>
    | FlatListProps<TEntity>['onEndReached'];
}

/**
 * Flat list wrapper
 */
const FlatList = <T,>({
  data,
  EmptyComponent,
  PlaceholderComponent,
  emptyListTitle,
  emptyListText,
  emptyListImg,
  onEndReached,
  totalEntities = 0,
  isFetching = false,
  isFirstRender = false,
  initialNumToRender = 5,
  ...props
}: IFlatList<T>) => {
  const length =
    data instanceof Animated.Node ? data?.[' __value']?.length ?? 0 : data?.length ?? 0;
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
        if (!onEndReachedCalledDuringMomentum.current && onEndReached) {
          onEndReachedCalledDuringMomentum.current = true;
          void onEndReached(params);
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
        isFetching={isFetching}
        isFirstRender={isFirstRender}
        PlaceholderComponent={PlaceholderComponent}
        count={initialNumToRender as number}
      />
      {!isFirstRender && (
        <Animated.FlatList<T>
          entering={FadeIn}
          data={data}
          refreshing={isFetching}
          initialNumToRender={initialNumToRender}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          layout={Layout.duration(300)}
          onMomentumScrollBegin={onMomentumScrollBegin}
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

export default FlatList;
