import { useEffect, useState } from 'react';
import { Animated } from 'react-native';

interface IUseAnimation {
  doAnimation: boolean;
  duration?: number;
  useNativeDriver?: boolean;
}

/**
 * Animation create helper
 */
const useAnimation = ({ doAnimation, duration = 300, useNativeDriver = true }: IUseAnimation) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: doAnimation ? 1 : 0,
      duration,
      useNativeDriver,
    }).start();
  }, [doAnimation]);

  return animation;
};

export default useAnimation;
