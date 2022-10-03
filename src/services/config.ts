import type { ConfigureParams } from '@react-native-google-signin/google-signin';
import _ from 'lodash';
import type { MessageOptions } from 'react-native-flash-message';
import type { HapticOptions } from 'react-native-haptic-feedback';
import type { ILogType } from './log';

export interface IConfigParams {
  googleSignInConfig?: ConfigureParams & { webClientId: string };
  logger?: ILogType;
  isLocalDevelopment?: boolean;
  isTests?: boolean;
  appKeyName?: string;
  appBranch?: string;
  topFlashMessage?: {
    colors?: {
      error: string;
      success: string;
      info: string;
      text: string;
    };
    options?: Partial<MessageOptions>;
  };
  hapticFeedbackOptions?: HapticOptions;
}

/**
 * Common class for share config between application and external packages
 * Call setup before start application
 */
class Config {
  /**
   * @private
   */
  private params: IConfigParams = {
    isLocalDevelopment: false,
    isTests: false,
    appKeyName: 'unknown',
    topFlashMessage: {
      colors: {
        error: '#DB3737',
        success: '#28a745',
        info: '#222224',
        text: '#ffffff',
      },
    },
    hapticFeedbackOptions: {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: true,
    },
  };

  /**
   * @private
   */
  private isSetup = false;

  /**
   * Set config
   */
  setup(params: IConfigParams): void {
    this.params = _.merge(this.params, params);
    this.isSetup = true;
  }

  /**
   * Get config
   */
  get<TKey extends keyof IConfigParams, TDefault = undefined>(
    key: TKey,
    defaultValue?: TDefault,
  ): IConfigParams[TKey] | TDefault {
    if (!this.isSetup) {
      console.warn("Don't try get config value before setup (Config.get).");
    }

    return this.params[key] ?? defaultValue;
  }
}

export default new Config();
