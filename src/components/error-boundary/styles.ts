import { fs } from '@lomray/react-native-layout-helper';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text: {
    paddingBottom: 10,
  },
  restartButtonText: {
    fontSize: fs(9),
  },
});

export default styles;
