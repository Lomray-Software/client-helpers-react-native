import { hp, wp } from '@lomray/react-native-layout-helper';
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
    paddingBottom: hp(6.158), // 50
    paddingHorizontal: wp(7.467), // 28
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  controlButtonBlock: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(1.478), // 12
    paddingBottom: hp(2.956), // 24
  },
  controlButton: {
    width: wp(11.733), // 44
    height: hp(0.493), // 4
    backgroundColor: 'rgba(18, 18, 29, 0.1)',
    borderRadius: 10,
  },
});

export default styles;
