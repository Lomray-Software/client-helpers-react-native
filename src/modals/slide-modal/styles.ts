import { fs, hp, wp } from '@lomray/react-native-layout-helper';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleWrapper: {
    backgroundColor: '#010101',
    height: hp(5.419), // 44
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: fs(4.533), // 17
  },
  doneWrapper: {
    position: 'absolute',
    right: wp(4.267), // 16
    zIndex: 1,
  },
  done: {
    color: '#0B84FE',
  },
});

export default styles;
