import { isAndroid, wp } from '@lomray/react-native-layout-helper';
import type {
  AnimationOptions,
  OptionsAnimationPropertyConfig,
  ViewAnimationOptions,
} from 'react-native-navigation';

const SCREEN_ANIMATION_DURATION = 300;

const baseAnimation: OptionsAnimationPropertyConfig = {
  duration: SCREEN_ANIMATION_DURATION,
  interpolation: {
    type: 'fastOutSlowIn',
  },
};

const slideInFromRight: ViewAnimationOptions = {
  translationX: {
    from: wp(100),
    to: 0,
    ...baseAnimation,
  },
};

const slideInFromLeft: ViewAnimationOptions = {
  translationX: {
    from: -50,
    to: 0,
    ...baseAnimation,
  },
};

const slideOutToLeft: ViewAnimationOptions = {
  translationX: {
    from: 0,
    to: -50,
    ...baseAnimation,
  },
};

const slideOutToRight: ViewAnimationOptions = {
  translationX: {
    from: 0,
    to: wp(100),
    ...baseAnimation,
  },
};

const slideOutAndExit: ViewAnimationOptions = {
  scaleX: {
    from: 1,
    to: 0.9,
    ...baseAnimation,
  },
  scaleY: {
    from: 1,
    to: 0.9,
    ...baseAnimation,
  },
  alpha: {
    ...baseAnimation,
    from: 1,
    to: 0,
    interpolation: {
      type: 'decelerate',
      factor: 0.8,
    },
  },
  translationY: {
    from: 0,
    to: 100,
    ...baseAnimation,
  },
};

/**
 * Screen animations
 *
 * @type {object}
 */
const screenAnimations: AnimationOptions = {
  ...(isAndroid
    ? {
        push: {
          content: {
            enter: slideInFromRight,
            exit: slideOutToLeft,
          },
        },
        pop: {
          content: {
            enter: slideInFromLeft,
            exit: slideOutToRight,
          },
        },
        setStackRoot: {
          waitForRender: true,
          content: {
            enter: slideInFromRight,
            exit: slideOutAndExit,
          },
        },
      }
    : {}),
  setRoot: {
    waitForRender: true,
    ...(isAndroid
      ? {
          enter: {
            waitForRender: true,
            alpha: {
              from: 0,
              to: 1,
              duration: 500,
              interpolation: {
                type: 'accelerate',
              },
            },
          },
          exit: {
            waitForRender: true,
            alpha: {
              from: 1,
              to: 0,
              duration: 1000,
              startDelay: 100,
              interpolation: {
                type: 'accelerate',
              },
            },
          },
        }
      : {
          alpha: {
            from: 0,
            to: 1,
            duration: 400,
            startDelay: 100,
            interpolation: {
              type: 'accelerate',
            },
          },
        }),
  },
};

export default screenAnimations;
