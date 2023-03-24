import { Amplitude as AmplitudeDefault, Identify } from '@amplitude/react-native';
import { isIOS } from '@lomray/react-native-layout-helper';
import type { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import _ from 'lodash';
import type { ConversionData } from 'react-native-appsflyer';
import appsFlyer from 'react-native-appsflyer';
import DeviceInfo from 'react-native-device-info';
import { Settings, AppEventsLogger } from 'react-native-fbsdk-next';
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';
import Config from './config';
import type { ILogType } from './log';

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
}

interface IAnalyticsParams {
  amplitudeToken: string;
  appsFlyerToken: string;
  appsFlyerId: string;
  isATT?: boolean;
  onTrackUser?: (
    user: Record<string, any>,
    params: {
      amplitude: Identify;
      google: FirebaseAnalyticsTypes.Module;
      fb: typeof AppEventsLogger;
      appsFlyer: typeof appsFlyer;
    },
  ) => boolean;
  onTrackEvent?: (
    eventName: string,
    props: Record<string, any>,
    params: {
      amplitude: AmplitudeDefault;
      google: FirebaseAnalyticsTypes.Module;
      fb: typeof AppEventsLogger;
      appsFlyer: typeof appsFlyer;
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
   * Disable analytics
   * @protected
   */
  protected isDisabled: boolean | undefined;

  /**
   * Production env
   * @protected
   */
  protected isProd = false;

  /**
   * Amplitude token
   * @protected
   */
  protected amplitudeToken: string;

  /**
   * AppsFlyer token
   * @protected
   */
  protected appsFlyerToken: string;

  /**
   * AppsFlyer app id
   * @protected
   */
  protected appsFlyerId: string;

  /**
   * @private
   */
  private logger?: ILogType;

  /**
   * Enable check app tracking transparency
   * @protected
   */
  protected isATT = true;

  /**
   * ATT status
   * @protected
   */
  protected hasAllowATT: boolean | null = null;

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
    amplitudeToken,
    appsFlyerToken,
    appsFlyerId,
    isATT,
    onTrackUser,
    onTrackEvent,
  }: IAnalyticsParams) {
    this.isDisabled = !Config.get('isProdDeployment');
    this.isProd = Config.get('isProd', false)!;
    this.logger = Config.get('logger');
    this.amplitudeToken = amplitudeToken;
    this.appsFlyerToken = appsFlyerToken;
    this.appsFlyerId = appsFlyerId;
    this.isATT = isATT ?? true;
    this.onTrackUser = onTrackUser;
    this.onTrackEvent = onTrackEvent;
  }

  /**
   * Init analytics
   */
  public static init(params: IAnalyticsParams) {
    if (this.instance === null) {
      this.instance = new Analytics(params);
      this.instance.initialize();
    }

    return this.instance;
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
  public static registerDeepLinkListeners(): () => void {
    return appsFlyer.onInstallConversionData((res) => {
      Analytics.deepLinkData = res.data;
    });
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
  protected initialize(): void {
    if (this.isDisabled) {
      return;
    }

    const Amplitude = AmplitudeDefault.getInstance();

    void Amplitude.init(this.amplitudeToken);
    Settings.initializeSDK();
    appsFlyer.initSdk(
      {
        devKey: this.appsFlyerToken,
        isDebug: !this.isProd,
        appId: this.appsFlyerId,
        manualStart: true,
        onInstallConversionDataListener: true,
        onDeepLinkListener: false,
        timeToWaitForATTUserAuthorization: 10,
      },
      (result) => {
        this.logger?.info('AppsFlyer success initialize: ', result);
      },
      (error) => {
        this.logger?.warn('AppsFlyer failed initialize: ', error);
      },
    );

    // Enable analytic collection only for production
    void this.checkATT().then((result) => {
      if (!result) {
        return;
      }

      void Settings.setAdvertiserTrackingEnabled(true);
      void analytics().setAnalyticsCollectionEnabled(this.isProd);
      void Amplitude.setDeviceId(DeviceInfo.getUniqueId());
    });
  }

  /**
   * Check APP TRACKING TRANSPARENCY
   * @protected
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
   * @protected
   */
  protected setUser(user: Record<string, any>): void {
    if (this.isDisabled || !this.isATT) {
      return;
    }

    if (!user) {
      return;
    }

    const Amplitude = AmplitudeDefault.getInstance();

    void this.checkATT().then((result) => {
      if (!result || !user) {
        return;
      }

      const { id, ...properties } = user;

      const userId = id as string;
      const identify = new Identify();

      const shouldSkip = this.onTrackUser?.(user, {
        amplitude: identify,
        google: analytics(),
        fb: AppEventsLogger,
        appsFlyer,
      });

      if (!shouldSkip) {
        void analytics().setUserProperties(properties);
        void Amplitude.setUserProperties(properties);
        AppEventsLogger.setUserData(
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

      void Amplitude.setUserId(userId);
      void Amplitude.identify(identify);
      void crashlytics().setUserId(userId);
      AppEventsLogger.setUserID(userId);
      appsFlyer.setCustomerUserId(userId);
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

    const Amplitude = AmplitudeDefault.getInstance();
    const shouldSkip =
      this.onTrackEvent?.(eventName, props, {
        google: analytics(),
        amplitude: Amplitude,
        fb: AppEventsLogger,
        appsFlyer,
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

        void Amplitude.logRevenue({ price, quantity: count, eventProperties: extraParams });
        void analytics().logPurchase({ value: price, currency });
        AppEventsLogger.logPurchase(price, currency, extraParams);
        void appsFlyer.logEvent('af_subscribe', {
          // eslint-disable-next-line camelcase
          af_revenue: price,
          // eslint-disable-next-line camelcase
          af_currency: currency,
          ...extraParams,
        });
        break;

      case APP_EVENT.APP_START:
        Object.assign(props, Analytics.deepLinkData);
        appsFlyer.startSdk();
        break;
    }

    void Amplitude.logEvent(eventName, props);
    AppEventsLogger.logEvent(eventName, props);
    void analytics().logEvent(eventName, props);
    void appsFlyer.logEvent(eventName, props);
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
