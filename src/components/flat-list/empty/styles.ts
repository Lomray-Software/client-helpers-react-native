import { fs, hp } from '@lomray/react-native-layout-helper';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  emptyBlock: {
    flex: 1,
    minHeight: hp(49.261), // 400
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: hp(-18.473), // -150,
    marginLeft: hp(-18.473), // -150,
    width: hp(36.946), // 300
    height: hp(36.946), // 300
  },
  noFoundTitle: {
    fontWeight: '600',
    fontSize: fs(6.4), // 24
    lineHeight: 26,
    marginBottom: hp(2.217), // 18
  },
  noFoundText: {
    lineHeight: 20,
    fontSize: fs(3.733), // 14
    fontWeight: '400',
  },
});

export default styles;
