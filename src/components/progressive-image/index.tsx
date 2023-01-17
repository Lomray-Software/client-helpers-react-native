import React, { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import type { ActivityIndicatorProps, ImageProps, ImageSourcePropType } from 'react-native';
import { Animated } from 'react-native';
import type { FastImageProps, Source, OnProgressEvent } from 'react-native-fast-image';
import FastImage from 'react-native-fast-image';
// eslint-disable-next-line import/default
import ReAnimated, {
  interpolateColor,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import type { CircleProps, SvgProps } from 'react-native-svg';
import Loader from '../loader';
import styles from './styles';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const AnimatedCircle = ReAnimated.createAnimatedComponent(Circle);
const radius = 45;
const circumference = radius * Math.PI * 2;
const duration = 1000;

interface IProgressiveImage {
  source: ImageSourcePropType | string;
  style?: ImageProps['style'];
  thumbnailSource?: ImageSourcePropType | string;
  loaderProps?: ActivityIndicatorProps;
  thumbnailProps?: Omit<ImageProps, 'source'>;
  sourceProps?: Omit<ImageProps, 'source'>;
  progressProps?: SvgProps;
  progressCircleProps?: CircleProps;
  fastProps?: FastImageProps;
  priority?: Source['priority'];
  isFastImg?: boolean;
  hasIndicator?: boolean;
  hasProgress?: boolean;
}

/**
 * Render progressive image
 * @constructor
 */
const ProgressiveImage: FC<IProgressiveImage> = ({
  source,
  thumbnailSource,
  style,
  sourceProps = {},
  thumbnailProps = {},
  fastProps = {},
  progressProps = {},
  progressCircleProps = {},
  priority = FastImage.priority.normal,
  loaderProps = {},
  isFastImg = false,
  hasIndicator = true,
  hasProgress = true,
}) => {
  const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false);
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);
  const [hasPassedDelay, setHasPassedDelay] = useState(false);
  const [sourceAnim] = useState(new Animated.Value(0));
  const [thumbnailAnim] = useState(new Animated.Value(0));
  const timerProgressId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!hasProgress) {
      return;
    }

    /**
     * Delay showing the progress
     */
    timerProgressId.current = setTimeout(() => {
      setHasPassedDelay(true);
    }, 2000);

    return () => {
      clearTimeout(timerProgressId.current);
    };
  }, []);

  /**
   * Circle animation
   * https://medium.com/react-native-rocket/animating-progress-rings-with-react-native-reanimated-2-9c19ad2115b
   */
  const strokeOffset = useSharedValue(circumference - 1);
  const percentage = useDerivedValue(() => {
    const number = ((circumference - strokeOffset.value) / circumference) * 100;

    return withTiming(number, { duration });
  });
  const strokeColor = useDerivedValue(() =>
    interpolateColor(
      percentage.value,
      [0, 50, 100],
      ['rgb(255,246,247)', 'rgba(246, 246, 89, 1)', 'rgba(79, 246, 89, 0.3)'],
    ),
  );
  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: withTiming(strokeOffset.value, { duration }),
    stroke: strokeColor.value,
  }));

  /**
   * Change animated value to visible thumbnail image
   */
  const onThumbnailLoad = () => {
    Animated.timing(thumbnailAnim, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
    setIsThumbnailLoaded(true);
  };

  /**
   * Change animated value to visible source image
   */
  const onSourceLoad = () => {
    Animated.timing(sourceAnim, {
      toValue: 1,
      useNativeDriver: false,
    }).start(() => {
      clearTimeout(timerProgressId.current);
      setIsSourceLoaded(true);
    });
  };

  /**
   * Source image progress load
   */
  const onProgressSourceLoad = ({ nativeEvent: { total, loaded } }: OnProgressEvent) => {
    if (!hasProgress) {
      return;
    }

    const loadPercent = Math.round((loaded / total) * 100);

    // load progress
    strokeOffset.value = circumference - (circumference * loadPercent) / 100;
  };

  const { style: sourceStyle, ...otherSourceProps } = sourceProps;
  const { style: thumbnailStyle, ...otherThumbnailProps } = thumbnailProps;
  const { style: loaderStyle, ...otherLoaderProps } = loaderProps;

  const isDisplayLoader = hasIndicator && !isThumbnailLoaded && !isSourceLoaded;
  const isDisplayProgress = hasProgress && hasPassedDelay && !isDisplayLoader && !isSourceLoaded;
  const isDisplayThumbnail = thumbnailSource && !isSourceLoaded;
  const isDisplaySource = isThumbnailLoaded || !thumbnailSource || isSourceLoaded;

  return (
    <>
      {isDisplayLoader && <Loader {...otherLoaderProps} style={[styles.overlay, loaderStyle]} />}
      {isDisplayProgress && (
        <Svg
          style={styles.overlay}
          height="100%"
          width="100%"
          viewBox="-75 -25 250 250"
          {...progressProps}
        >
          <AnimatedCircle
            cx="50"
            cy="50"
            r="45"
            stroke="rgb(246, 79, 89)"
            strokeWidth="3"
            fill="rgba(255,255,255,0.05)"
            {...progressCircleProps}
            animatedProps={animatedCircleProps}
            strokeDasharray={circumference}
          />
        </Svg>
      )}
      {isDisplayThumbnail && isFastImg ? (
        <AnimatedFastImage
          {...(typeof thumbnailSource === 'string'
            ? {
                source: {
                  uri: thumbnailSource,
                  priority,
                  cache: FastImage.cacheControl.immutable,
                },
              }
            : {})}
          {...fastProps}
          // @ts-ignore
          style={[style, thumbnailStyle, { opacity: thumbnailAnim }]}
          onLoad={onThumbnailLoad}
        />
      ) : (
        isDisplayThumbnail && (
          <Animated.Image
            blurRadius={2}
            {...otherThumbnailProps}
            source={
              typeof thumbnailSource === 'string' ? { uri: thumbnailSource } : thumbnailSource
            }
            style={[style, thumbnailStyle, { opacity: thumbnailAnim }]}
            onLoad={onThumbnailLoad}
          />
        )
      )}
      {isDisplaySource && isFastImg ? (
        <AnimatedFastImage
          {...(typeof source === 'string'
            ? {
                source: {
                  uri: source,
                  priority,
                  cache: FastImage.cacheControl.immutable,
                },
              }
            : {})}
          {...fastProps}
          // @ts-ignore
          style={[styles.overlay, style, sourceStyle, { opacity: sourceAnim }]}
          onLoad={onSourceLoad}
          onProgress={onProgressSourceLoad}
        />
      ) : (
        isDisplaySource && (
          <Animated.Image
            {...otherSourceProps}
            source={typeof source === 'string' ? { uri: source } : source}
            style={[styles.overlay, style, sourceStyle, { opacity: sourceAnim }]}
            onLoad={onSourceLoad}
            onProgress={onProgressSourceLoad}
          />
        )
      )}
    </>
  );
};

export default ProgressiveImage;
