import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(18, 18, 29, 0.6)',
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  dropdown: {
    marginTop: 'auto',
    justifyContent: 'flex-start',
    paddingBottom: 50,
    paddingHorizontal: 28,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  controlButtonBlock: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 24,
  },
  controlButton: {
    width: 44,
    height: 4,
    backgroundColor: 'rgba(18, 18, 29, 0.1)',
    borderRadius: 10,
  },
});

export default styles;
