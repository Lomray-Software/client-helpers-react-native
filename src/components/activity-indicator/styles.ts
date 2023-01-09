import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapperIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#010101',
    zIndex: 100,
    flex: 1,
  },
  wrapperIndicatorTransparent: {
    backgroundColor: 'rgba(1,1,1, 0.5)',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default styles;
