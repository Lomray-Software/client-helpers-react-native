import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Config from './config';
import type { ILogType } from './log';

interface IVersionCheckOptions {
  iosStoreId?: string;
  bundleId: string;
}

/**
 * Check app version from stores
 */
class VersionCheck {
  /**
   * @private
   */
  private readonly options: IVersionCheckOptions;

  /**
   * @private
   */
  private logger?: ILogType;

  /**
   * @constructor
   * @private
   */
  private constructor(options: IVersionCheckOptions) {
    this.options = options;
    this.logger = Config.get('logger');
  }

  /**
   * Init service
   */
  public static init(options: IVersionCheckOptions): VersionCheck {
    return new VersionCheck(options);
  }

  /**
   * Get store app version
   */
  private async getStoreVersion(): Promise<string | null> {
    const { bundleId, iosStoreId } = this.options;

    const storeUrl = Platform.select({
      ios: `https://itunes.apple.com/lookup?bundleId=${bundleId}&date=${Date.now()}`,
      android: `https://play.google.com/store/apps/details?id=${bundleId}&hl=en&gl=US`,
    }) as string;

    try {
      const res = await fetch(storeUrl, {
        headers: { 'sec-fetch-site': 'same-origin' },
      });

      if (Platform.OS === 'android') {
        const text = await res.text();

        const match = text.match(/Current Version.+?>([\d.-]+)<\/span>/);

        if (match) {
          return match[1].trim();
        }

        const matchNewLayout = text.match(/\[\[\["([\d.]+?)"\]\]/);

        if (matchNewLayout) {
          return matchNewLayout[1].trim();
        }

        return null;
      }

      // IOS case
      const result = await res.json();

      if (result.resultCount) {
        if (!iosStoreId) {
          this.options.iosStoreId = result?.results?.[0]?.trackId;
        }

        return (result?.results?.[0]?.version as string) ?? null;
      }
    } catch (e) {
      this.logger?.error('Failed get store version: ', e);
    }

    return null;
  }

  /**
   * Check if current version is old and need update
   */
  public async needUpdate(): Promise<{ hasUpdate: boolean; storeUrl: string }> {
    const currentVersion = DeviceInfo.getVersion();
    const storeVersion = await this.getStoreVersion();

    return {
      hasUpdate: Boolean(storeVersion && currentVersion && storeVersion > currentVersion),
      storeUrl: this.getStoreUrl(),
    };
  }

  /**
   * Get store url
   */
  public getStoreUrl(): string {
    const { bundleId, iosStoreId } = this.options;

    return Platform.select({
      ios: `itms-apps://apps.apple.com/app/id${iosStoreId as string}`,
      android: `https://play.google.com/store/apps/details?id=${bundleId}&hl=en&gl=US`,
    }) as string;
  }
}

export default VersionCheck;
