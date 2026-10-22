import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleWrapper: {
    backgroundColor: '#010101',
    height: 44,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
  },
  doneWrapper: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  done: {
    color: '#0B84FE',
  },
});

export default styles;
