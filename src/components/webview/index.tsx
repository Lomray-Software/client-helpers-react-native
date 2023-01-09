import React from 'react';
import type { FC } from 'react';
import { View } from 'react-native';
import { WebView as RNWebview } from 'react-native-webview';
import ActivityIndicator from '../activity-indicator';
import styles from './styles';

interface IWebview {
  uri: string;
}

/**
 * Custom webview component with loading.
 */
const WebView: FC<IWebview> = ({ uri }) => (
  <View style={styles.container}>
    <RNWebview
      startInLoadingState
      renderLoading={() => (
        <View style={styles.wrapperLoader}>
          <ActivityIndicator isFetching size="large" />
        </View>
      )}
      source={{ uri }}
      style={styles.container}
    />
  </View>
);

export default WebView;
