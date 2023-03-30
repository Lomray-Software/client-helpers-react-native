import type { TCallback } from '@lomray/client-helpers/interfaces';
import { isIOS } from '@lomray/react-native-layout-helper';
import { action, computed, makeObservable, observable } from 'mobx';
import { AppState } from 'react-native';
import type { SyncOptions } from 'react-native-code-push';
import CodePush from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';
import Config from '../../services/config';
import type { ILogType } from '../../services/log';

/**
 * Application version store
 */
class AppVersionStore {
  /**
   * This is singleton
   */
  static isSingleton = true;

  /**
   * Current application version
   */
  public version = DeviceInfo.getVersion();

  /**
   * Current application build number
   */
  public build = DeviceInfo.getBuildNumber();

  /**
   * Codepush version
   *
   * c - codepush build
   * n - native build
   * e - error
   */
  public codepushVersion = '';

  /**
   * Unsubscribe callback
   * @private
   */
  private unsubscribeAppCheck: TCallback | void;

  /**
   * @private
   */
  private logger?: ILogType;

  /**
   * @constructor
   */
  constructor() {
    this.logger = Config.get('logger');

    makeObservable(this, {
      version: observable,
      build: observable,
      codepushVersion: observable,
      versionOutput: computed,
      setCodepushVersion: action,
    });

    CodePush.getUpdateMetadata()
      .then((update) => {
        if (update) {
          this.setCodepushVersion(`c-${update.label}`);
        } else {
          this.setCodepushVersion('n');
        }
      })
      .catch(() => {
        this.setCodepushVersion('e');
      });
  }

  /**
   * Add codepush subscribers
   */
  public addSubscribes = () => {
    if (typeof this.unsubscribeAppCheck === 'function') {
      this.unsubscribeAppCheck();
    }

    this.unsubscribeAppCheck = this.listenCodePush();
  };

  /**
   * Set codepush version
   */
  public setCodepushVersion(version: string): void {
    this.codepushVersion = version;
  }

  /**
   * App version
   */
  get versionOutput() {
    const debugPrefix = Config.get('isLocalDevelopment') ? 'd' : '';
    const version = `v${this.version}(${this.build}${debugPrefix}-${this.codepushVersion})`;

    Config.get('logger')?.setPayload('appVersion', version);

    return version;
  }

  /**
   * Check codepush releases and apply
   * @private
   */
  private listenCodePush(): TCallback | void {
    const isRealDevice = DeviceInfo.getDeviceType() !== 'unknown' && !DeviceInfo.isEmulatorSync();

    // Disable codepush for simulators
    if (!isRealDevice || Config.get('isLocalDevelopment')) {
      return;
    }

    const keys = Config.get('codepush');

    if (!keys) {
      this.logger?.warn('Codepush keys not configure.');

      return;
    }

    const { ios, android } = keys;
    const isDev = Config.get('isLocalDevelopment');
    const options: SyncOptions = {
      ...(isDev
        ? {
            updateDialog: {
              title: 'New cloud update',
            },
          }
        : {
            installMode: CodePush.InstallMode.IMMEDIATE,
          }),
    };

    const updateFunc = () => {
      void CodePush.sync({ ...options, deploymentKey: isIOS ? ios : android })
        .then((res) => {
          this.logger?.info('App updated: ', res);
        })
        .catch((e) => {
          this.logger?.info('App update false: ', e);
        });
    };

    // run first time
    updateFunc();

    // check new release on app state change
    const unsubscribe = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        updateFunc();
      }
    });

    return () => unsubscribe.remove();
  }
}

export default AppVersionStore;
