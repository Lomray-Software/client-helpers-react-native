import React, { useState } from 'react';
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

  const thumbnailAnimated = useSharedValue(0);
  const imageAnimated = useSharedValue(0);

  const animatedStyleThumbnail = useAnimatedStyle(() => ({
    opacity: withTiming(thumbnailAnimated.value, {
      easing: Easing.ease,
    }),
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(imageAnimated.value, {
      easing: Easing.ease,
    }),
  }));

  const onThumbnailLoad = () => {
    thumbnailAnimated.value = 1;
    setIsThumbnailLoaded(true);
  };

  const onImageLoad = () => (imageAnimated.value = 1);

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
