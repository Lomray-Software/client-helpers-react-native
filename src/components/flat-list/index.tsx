import type { ComponentType, ReactElement } from 'react';
import React from 'react';
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
  onRefresh?: (() => Promise<void>) | FlatListProps<TEntity>['onRefresh'];
  onEndReached?: (() => Promise<void>) | FlatListProps<TEntity>['onEndReached'];
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
  totalEntities = 0,
  isFetching = false,
  isFirstRender = false,
  initialNumToRender = 5,
  ...props
}: IFlatList<T>) => {
  const length =
    data instanceof Animated.Node ? data?.[' __value']?.length ?? 0 : data?.length ?? 0;
  const hasRows = length > 0;

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
