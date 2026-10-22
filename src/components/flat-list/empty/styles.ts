import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  emptyBlock: {
    flex: 1,
    minHeight: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -150,
    marginLeft: -150,
    width: 300,
    height: 300,
  },
  noFoundTitle: {
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 26,
    marginBottom: 18,
  },
  noFoundText: {
    lineHeight: 20,
    fontSize: 14,
    fontWeight: '400',
  },
});

export default styles;
