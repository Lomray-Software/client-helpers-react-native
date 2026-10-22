import { computed, makeObservable, observable } from 'mobx';
import DeviceInfo from 'react-native-device-info';
import Config from '../../services/config';

/**
 * Application version store
 */
class AppVersionStore {
  /**
   * This is singleton
   */
  static isGlobal = true;

  /**
   * Current application version
   */
  public version = DeviceInfo.getVersion();

  /**
   * Current application build number
   */
  public build = DeviceInfo.getBuildNumber();

  /**
   * @constructor
   */
  constructor() {
    makeObservable(this, {
      version: observable,
      build: observable,
      versionOutput: computed,
    });
  }

  /**
   * App version
   */
  get versionOutput() {
    const debugPrefix = Config.get('isLocalDevelopment') ? 'd' : '';
    const version = `v${this.version}(${this.build}${debugPrefix})`;

    Config.get('logger')?.setPayload('appVersion', version);

    return version;
  }
}

export default AppVersionStore;
