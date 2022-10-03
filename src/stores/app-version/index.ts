import { action, computed, makeObservable, observable } from 'mobx';
import codePush from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';
import Config from '../../services/config';

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
   * @constructor
   */
  constructor() {
    makeObservable(this, {
      version: observable,
      build: observable,
      codepushVersion: observable,
      versionOutput: computed,
      setCodepushVersion: action,
    });

    codePush
      .getUpdateMetadata()
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
}

export default AppVersionStore;
