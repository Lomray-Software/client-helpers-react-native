import { isIOS } from '@lomray/react-native-layout-helper';
import type { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import _ from 'lodash';
import type { ConversionData } from 'react-native-appsflyer';
import DeviceInfo from 'react-native-device-info';
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';
import Config from './config';
import type { ILogType } from './log';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type FacebookSDK = typeof import('react-native-fbsdk-next');
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type AmplitudeSDK = typeof import('@amplitude/react-native');
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type AppsFlyerSDK = typeof import('react-native-appsflyer');

type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (
  ...args: any
) => infer R
  ? R
  : any;

enum APP_EVENT {
  APP_START = 'app_start',
  VIEW_SCREEN = 'view_screen',
  VIEW_OVERLAY = 'view_overlay',
  VIEW_MODAL = 'view_modal',
  CHANGE_APP_STATE = 'change_app_state',
  CHANGE_STACK_ROOT = 'change_stack_root',
  USER_SIGN_IN = 'user_sign_in',
  USER_SIGN_UP = 'user_sign_up',
  PURCHASE = 'purchase',
  PURCHASE_TRIAL = 'purchase_trial',
  AD_SHOW = 'custom_ad_show',
  AD_CLICK = 'custom_ad_click',
  PUSH_NOTIFICATION_OPEN = 'push_notification_open',
  PUSH_NOTIFICATION_INITIAL = 'push_notification_initial',
  DEEP_LINK_OPEN = 'deep_link_opened',
  DEEP_LINK_INITIAL = 'deep_link_initial',
}

interface IAnalyticsParams {
  sdk: {
    facebook?: FacebookSDK;
    amplitude?: AmplitudeSDK;
    appsflyer?: AppsFlyerSDK['default'];
  };
  amplitudeToken?: string;
  appsFlyerToken?: string;
  appsFlyerId?: string;
  hasRegisterDeepLinkListeners?: boolean;
  isATT?: boolean;
  onATT?: (isAllow: boolean) => void;
  onTrackUser?: (
    user: Record<string, any>,
    params: {
      google: FirebaseAnalyticsTypes.Module;
      amplitude?: InstanceType<AmplitudeSDK['Identify']>;
      fb?: FacebookSDK['AppEventsLogger'];
      appsFlyer?: AppsFlyerSDK['default'];
    },
  ) => boolean;
  onTrackEvent?: (
    eventName: string,
    props: Record<string, any>,
    params: {
      google: FirebaseAnalyticsTypes.Module;
      amplitude?: ReturnType<AmplitudeSDK['Amplitude']['getInstance']>;
      appsFlyer?: AppsFlyerSDK['default'];
      fb?: FacebookSDK['AppEventsLogger'];
    },
  ) => void;
}

/**
 * Application analytics
 */
class Analytics {
  /**
   * @protected
   */
  protected static instance: Analytics | null = null;

  /**
   * Analytics available SDK's
   */
  protected sdk: IAnalyticsParams['sdk'];

  /**
   * Disable analytics
   * @protected
   */
  protected isDisabled: boolean | undefined;

  /**
   * Production env
   */
  protected isProd = false;

  /**
   * Amplitude token
   */
  protected amplitudeToken?: string;

  /**
   * AppsFlyer token
   */
  protected appsFlyerToken?: string;

  /**
   * AppsFlyer app id
   */
  protected appsFlyerId?: string;

  /**
   * Register deep ling listeners
   */
  protected hasRegisterDeepLinkListeners: boolean;

  /**
   * @private
   */
  private logger?: ILogType;

  /**
   * Enable check app tracking transparency
   */
  protected isATT = true;

  /**
   * ATT status
   * @protected
   */
  protected hasAllowATT: boolean | null = null;

  /**
   * Trigger when ATT resolves
   * @protected
   */
  protected onATT: IAnalyticsParams['onATT'];

  /**
   * Extra user set callback
   * @protected
   */
  protected onTrackUser: IAnalyticsParams['onTrackUser'];

  /**
   * Extra event callback
   * @protected
   */
  protected onTrackEvent: IAnalyticsParams['onTrackEvent'];

  /**
   * @protected
   */
  protected static deepLinkData: ConversionData['data'] | null = null;

  /**
   * @constructor
   * @private
   */
  private constructor({
    sdk,
    amplitudeToken,
    appsFlyerToken,
    appsFlyerId,
    isATT,
    onATT,
    onTrackUser,
    onTrackEvent,
    hasRegisterDeepLinkListeners = false,
  }: IAnalyticsParams) {
    this.isDisabled = !Config.get('isProdDeployment');
    this.isProd = Config.get('isProd', false)!;
    this.logger = Config.get('logger');
    this.sdk = sdk;
    this.amplitudeToken = amplitudeToken;
    this.appsFlyerToken = appsFlyerToken;
    this.appsFlyerId = appsFlyerId;
    this.hasRegisterDeepLinkListeners = hasRegisterDeepLinkListeners;
    this.isATT = isATT ?? true;
    this.onATT = onATT;
    this.onTrackUser = onTrackUser;
    this.onTrackEvent = onTrackEvent;
  }

  /**
   * Init analytics
   */
  public static init(params: IAnalyticsParams): ReturnType<Analytics['initialize']> {
    if (this.instance === null) {
      this.instance = new Analytics(params);
    }

    return this.instance.initialize();
  }

  /**
   * Get instance
   */
  public static get(): Analytics {
    if (!this.instance) {
      throw new Error('Call "init" before try to get analytic instance.');
    }

    return this.instance;
  }

  /**
   * Add deep link listeners
   */
  protected registerDeepLinkListeners(): () => void {
    if (!this.hasRegisterDeepLinkListeners) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      return _.noop;
    }

    const unsubscribe = this.sdk.appsflyer?.onInstallConversionData((res) => {
      Analytics.deepLinkData = res.data;
    });

    return () => {
      unsubscribe?.();
    };
  }

  /**
   * Get ATT status
   */
  public getATTStatus(): boolean | null {
    return this.hasAllowATT;
  }

  /**
   * Initialize analytics, show permission modals
   * @protected
   */
  protected initialize(): Promise<unknown[] | boolean | [boolean, any]> {
    if (this.isDisabled) {
      return Promise.resolve(false);
    }

    this.sdk.facebook?.Settings.initializeSDK();

    const result = [];
    const Amplitude = this.sdk.amplitude?.Amplitude.getInstance();

    if (Amplitude && this.amplitudeToken) {
      result.push(
        Amplitude.init(this.amplitudeToken)
          .then((value) => {
            this.logger?.info('Amplitude success initialize: ', value);

            return value;
          })
          .catch((e) => {
            this.logger?.warn('Amplitude failed initialize: ', e);

            return false;
          }),
      );
    }

    if (this.appsFlyerId && this.appsFlyerToken && this.sdk.appsflyer) {
      result.push(
        new Promise((resolve) => {
          this.sdk.appsflyer!.initSdk(
            {
              devKey: this.appsFlyerToken!,
              isDebug: !this.isProd,
              appId: this.appsFlyerId,
              manualStart: true,
              onInstallConversionDataListener: true,
              onDeepLinkListener: false,
              timeToWaitForATTUserAuthorization: 10,
            },
            (res) => {
              this.logger?.info('AppsFlyer success initialize: ', res);

              resolve(res);
            },
            (error) => {
              this.logger?.warn('AppsFlyer failed initialize: ', error);

              resolve(false);
            },
          );
        }),
      );
    }

    return Promise.all(result);
  }

  /**
   * Initial check ATT
   * Enable analytic collection only for production
   */
  public initialATT = async (): Promise<void> => {
    try {
      await this.checkATT().then((result) => {
        this.onATT?.(result);

        if (!result) {
          return;
        }

        void this.sdk.facebook?.Settings.setAdvertiserTrackingEnabled(true);
        void analytics().setAnalyticsCollectionEnabled(this.isProd);
        void this.sdk.amplitude?.Amplitude.getInstance().setDeviceId(DeviceInfo.getUniqueIdSync());
      });
    } catch (e) {
      this.logger?.info('Request app tracking transparency failed.', e);
    }
  };

  /**
   * Check APP TRACKING TRANSPARENCY
   */
  protected async checkATT(): Promise<boolean> {
    if (!isIOS || !this.isATT) {
      return true;
    }

    let status = await getTrackingStatus();

    if (status === 'not-determined') {
      this.logger?.info('Request app tracking transparency...');
      status = await requestTrackingPermission();
    }

    this.hasAllowATT = status === 'unavailable' || status === 'authorized';

    this.logger?.info('App tracking transparency status: ', status);

    return this.hasAllowATT;
  }

  /**
   * Set user
   */
  protected setUser(user: Record<string, any>): void {
    if (this.isDisabled || !this.isATT) {
      return;
    }

    if (!user) {
      return;
    }

    const Amplitude = this.sdk.amplitude?.Amplitude.getInstance();

    void this.checkATT().then((result) => {
      if (!result || !user) {
        return;
      }

      const { id, ...properties } = user;

      const userId = String(id);
      const identify = this.sdk.amplitude ? new this.sdk.amplitude.Identify() : undefined;

      const shouldSkip = this.onTrackUser?.(user, {
        amplitude: identify,
        google: analytics(),
        fb: this.sdk.facebook?.AppEventsLogger,
        appsFlyer: this.sdk.appsflyer,
      });

      if (!shouldSkip) {
        void analytics().setUserProperties(properties);
        void Amplitude?.setUserProperties(properties);
        this.sdk.facebook?.AppEventsLogger.setUserData(
          _.pick(properties, [
            'email',
            'firstName',
            'lastName',
            'phone',
            'dateOfBirth',
            'gender',
            'city',
            'state',
            'zip',
            'country',
          ]),
        );
      }

      void Amplitude?.setUserId(userId);
      void Amplitude?.identify(identify!);
      void crashlytics().setUserId(userId);
      this.sdk.facebook?.AppEventsLogger.setUserID(userId);
      this.sdk.appsflyer?.setCustomerUserId(userId);
    });
  }

  /**
   * Track event
   * @protected
   */
  protected setEvent(eventName: string, props: Record<string, any> = {}): void {
    if (this.isDisabled) {
      return;
    }

    const Amplitude = this.sdk.amplitude?.Amplitude.getInstance();
    const shouldSkip =
      this.onTrackEvent?.(eventName, props, {
        google: analytics(),
        amplitude: Amplitude,
        fb: this.sdk.facebook?.AppEventsLogger,
        appsFlyer: this.sdk.appsflyer,
      }) ?? false;

    if (shouldSkip) {
      return;
    }

    switch (eventName) {
      case APP_EVENT.VIEW_MODAL:
      case APP_EVENT.VIEW_SCREEN:
      case APP_EVENT.VIEW_OVERLAY:
        // eslint-disable-next-line camelcase
        void analytics().logScreenView({ screen_name: props?.name, screen_class: eventName });
        break;

      case APP_EVENT.CHANGE_APP_STATE:
        if (props.nextAppState === 'active') {
          void analytics().logAppOpen();
        }

        break;

      case APP_EVENT.USER_SIGN_UP:
        void analytics().logSignUp({ method: props.method });
        break;

      case APP_EVENT.USER_SIGN_IN:
        void analytics().logLogin({ method: props.method });
        break;

      case APP_EVENT.PURCHASE:
        const price = Number(Number(props.price || 0).toFixed(2));
        const currency = (props.currency || 'USD') as string;
        const count = Number(props.count || 1);
        const extraParams = (props.params || {}) as Record<string, any>;

        void Amplitude?.logRevenue({ price, quantity: count, eventProperties: extraParams });
        void analytics().logPurchase({ value: price, currency });
        this.sdk.facebook?.AppEventsLogger.logPurchase(price, currency, extraParams);
        void this.sdk.appsflyer?.logEvent('af_subscribe', {
          // eslint-disable-next-line camelcase
          af_revenue: price,
          // eslint-disable-next-line camelcase
          af_currency: currency,
          ...extraParams,
        });
        break;

      case APP_EVENT.APP_START:
        Object.assign(props, Analytics.deepLinkData);
        this.sdk.appsflyer?.startSdk();
        break;
    }

    void Amplitude?.logEvent(eventName, props);
    this.sdk.facebook?.AppEventsLogger.logEvent(eventName, props);
    void analytics().logEvent(eventName, props);
    void this.sdk.appsflyer?.logEvent(eventName, props);
  }

  /**
   * Set user identity to analytics
   */
  public static trackUser(user: Record<string, any>): void {
    return Analytics.get().setUser(user);
  }

  /**
   * Track application event
   */
  public static trackEvent(eventName: string, props: Record<string, any> = {}): void {
    return Analytics.get().setEvent(eventName, props);
  }
}

export { APP_EVENT, Analytics };
