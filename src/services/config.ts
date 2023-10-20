import type { ConfigureParams } from '@react-native-google-signin/google-signin';
import _ from 'lodash';
import type { MessageOptions, MessageType } from 'react-native-flash-message';
import type { HapticOptions } from 'react-native-haptic-feedback';
import type { ILogType } from './log';

export interface IConfigParams {
  googleSignInConfig?: ConfigureParams & { webClientId: string };
  logger?: ILogType;
  isLocalDevelopment?: boolean;
  isTests?: boolean;
  isProd?: boolean;
  isProdDeployment?: boolean;
  appKeyName?: string;
  appBranch?: string;
  packageName?: string;
  topFlashMessage?: Partial<Record<MessageType, Partial<MessageOptions>>> & {
    commonOptions?: Partial<MessageOptions>;
  };
  hapticFeedbackOptions?: HapticOptions;
  codepush?: {
    ios: string;
    android: string;
  };
  indicators?: {
    activity?: {
      color: string;
      backgroundColor?: string;
    };
    loader?: {
      color: string;
    };
  };
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
    isProd: false,
    isProdDeployment: false,
    appKeyName: 'unknown',
    topFlashMessage: {
      danger: {
        backgroundColor: '#DB3737',
      },
      success: {
        backgroundColor: '#28a745',
      },
      info: {
        backgroundColor: '#222224',
      },
    },
    hapticFeedbackOptions: {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: true,
    },
    indicators: {
      activity: {
        color: '#FFFFFF',
      },
      loader: {
        color: '#FFFFFF',
      },
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
    this.params = _.merge(this.params ?? {}, params ?? {});
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

    return this.params?.[key] ?? defaultValue;
  }
}

export default new Config();
