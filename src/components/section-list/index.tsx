import type { ReplaceReturnType } from '@lomray/client-helpers/interfaces';
import _ from 'lodash';
import type { ComponentType, ReactElement } from 'react';
import React, { useCallback, useRef } from 'react';
import type { ImageSourcePropType, SectionListProps } from 'react-native';
import { SectionList as DefaultSectionList } from 'react-native';
// eslint-disable-next-line import/default
import Animated, { Layout, FadeIn } from 'react-native-reanimated';
import Empty from '../flat-list/empty';
import Footer from '../flat-list/footer';
import Placeholder from '../placeholders/frame';

export interface ISectionList<TEntity = Record<string, any>> extends SectionListProps<TEntity> {
  emptyListTitle?: string;
  emptyListText?: string;
  emptyListImg?: ImageSourcePropType;
  totalEntities?: number;
  isFetching?: boolean;
  isFirstRender?: boolean;
  placeholderCount?: number;
  placeholderContainerStyle?: Animated.AnimateProps<any>['style'];
  EmptyComponent?: ReactElement | false;
  PlaceholderComponent?: ReactElement | ComponentType;
  onRefresh?:
    | ReplaceReturnType<NonNullable<SectionListProps<TEntity>['onRefresh']>, Promise<any>>
    | SectionListProps<TEntity>['onRefresh'];
  onEndReached?:
    | ReplaceReturnType<NonNullable<SectionListProps<TEntity>['onEndReached']>, Promise<any>>
    | SectionListProps<TEntity>['onEndReached'];
}

/**
 * Section list wrapper
 */
const SectionList = <T,>({
  data,
  EmptyComponent,
  PlaceholderComponent,
  emptyListTitle,
  emptyListText,
  emptyListImg,
  onEndReached,
  placeholderCount,
  placeholderContainerStyle,
  totalEntities = 0,
  isFetching = false,
  isFirstRender = false,
  initialNumToRender = 5,
  ...props
}: ISectionList<T>) => {
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
      (params: Parameters<NonNullable<SectionListProps<never>['onEndReached']>>[0]) => {
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
        count={placeholderCount ?? initialNumToRender}
        isFetching={isFetching}
        isFirstRender={isFirstRender}
        containerStyle={placeholderContainerStyle}
        PlaceholderComponent={PlaceholderComponent}
      />
      {!isFirstRender && (
        <Animated.View entering={FadeIn} layout={Layout.duration(300)}>
          <DefaultSectionList<T>
            data={data}
            refreshing={isFetching}
            initialNumToRender={initialNumToRender}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
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
        </Animated.View>
      )}
    </>
  );
};

export default SectionList;
