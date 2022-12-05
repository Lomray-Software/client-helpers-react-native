import { useEffect, useState } from 'react';
import { Animated } from 'react-native';

interface IUseAnimation {
  doAnimation: boolean;
  duration?: number;
  useNativeDriver?: boolean;
  toValue?: number;
}

/**
 * Animation create helper
 */
const useAnimation = ({
  doAnimation,
  duration = 300,
  useNativeDriver = true,
  toValue = 1,
}: IUseAnimation) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: doAnimation ? toValue : 0,
      duration,
      useNativeDriver,
    }).start();
  }, [doAnimation]);

  return animation;
};

export default useAnimation;
