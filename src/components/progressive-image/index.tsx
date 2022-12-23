import React, { useCallback, useState } from 'react';
import type { FC } from 'react';
import type { ImageProps, ImageSourcePropType, ViewStyle } from 'react-native';
import { View } from 'react-native';
// eslint-disable-next-line import/default
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styles from './styles';

interface IProgressiveImage extends ImageProps {
  thumbnailSource?: ImageSourcePropType | string;
  additionalContainerStyles?: ViewStyle;
}

const ProgressiveImage: FC<IProgressiveImage> = ({
  thumbnailSource,
  style,
  source,
  additionalContainerStyles = {},
  ...props
}) => {
  const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false);

  /**
   * Value blur for thumbnail image
   */
  const thumbnailAnimated = useSharedValue(0);

  /**
   * Value blur for default image
   */
  const imageAnimated = useSharedValue(0);

  /**
   * Animated opacity for thumbnail image
   */
  const animatedStyleThumbnail = useAnimatedStyle(() => ({
    opacity: withTiming(thumbnailAnimated.value, {
      easing: Easing.ease,
    }),
  }));

  /**
   * Animated opacity for default image
   */
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(imageAnimated.value, {
      easing: Easing.ease,
    }),
  }));

  /**
   * Change state indicator for loading original image and change animated value
   */
  const onThumbnailLoad = useCallback(() => {
    thumbnailAnimated.value = 1;
    setIsThumbnailLoaded(true);
  }, [setIsThumbnailLoaded, thumbnailAnimated.value]);

  /**
   * Change animated value to visible default image
   */
  const onImageLoad = useCallback(() => (imageAnimated.value = 1), [imageAnimated.value]);

  return (
    <View style={additionalContainerStyles}>
      {thumbnailSource ? (
        <Animated.Image
          {...props}
          source={typeof thumbnailSource === 'string' ? { uri: thumbnailSource } : thumbnailSource}
          style={[style, animatedStyleThumbnail]}
          onLoad={onThumbnailLoad}
          blurRadius={10}
        />
      ) : (
        <Animated.Image {...props} source={source} style={[styles.imageOverlay, style]} />
      )}
      {isThumbnailLoaded && (
        <Animated.Image
          {...props}
          source={source}
          style={[styles.imageOverlay, animatedStyle, style]}
          onLoad={onImageLoad}
        />
      )}
    </View>
  );
};

export default ProgressiveImage;
