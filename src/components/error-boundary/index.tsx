import type { ErrorInfo, ReactNode } from 'react';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import type { WithTranslation } from 'react-i18next';
import { Text, View, Button } from 'react-native';
import CodePush from 'react-native-code-push';
import Config from '../../services/config';
import styles from './styles';

interface IErrorBoundary {
  hasError: boolean;
}

class ErrorBoundary extends Component<WithTranslation & { children: ReactNode }, IErrorBoundary> {
  state = {
    hasError: false,
  };

  /**
   * Handle app errors
   */
  componentDidCatch(e: Error, errorInfo: ErrorInfo): void {
    Config.get('logger')?.error(`React DOM error: ${e.message}`, { ...e, ...errorInfo });
  }

  static getDerivedStateFromError(): IErrorBoundary {
    // Show emergency UI
    return { hasError: true };
  }

  /**
   * Reload app
   */
  handleReloadApp = () => {
    CodePush.restartApp();
  };

  render(): ReactNode {
    const { children, t } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>{t('somethingWrong')}</Text>
          <Button title={t('reloadApp')} onPress={this.handleReloadApp} />
        </View>
      );
    }

    return children;
  }
}

export default withTranslation()(ErrorBoundary);
