import batcher from 'atomic-batcher';
import axios from 'axios';
import type { configLoggerType, transportFunctionType } from 'react-native-logs';
import { logger, consoleTransport } from 'react-native-logs';
import uuid from 'react-native-uuid';
import Config from './config';

type TLogger = ReturnType<typeof logger['createLogger']>;

export interface ILogType extends TLogger {
  payload: Record<string, any>;
  setPayload(key: string, value: string): void;
}

export interface ILoggerOptions {
  params?: configLoggerType;
  crashlytics?: any;
  grafana?: {
    url: string;
    token: string;
  };
}

/**
 * Firebase crashlytics transport
 */
const firebaseCrashlyticsTransport = (
  crashlytics: ILoggerOptions['crashlytics'],
  { msg, level, rawMsg }: Parameters<transportFunctionType>[0],
): void => {
  crashlytics.log(msg as string);

  const error = rawMsg?.[1] ?? null;

  if (level.text === 'error' && error?.message) {
    crashlytics.recordError(error as Error);
  }
};

/**
 * Grafana loki transport
 * Batching handle logs
 */
const grafanaLokiTransport = ({
  appKeyName,
  appBranch,
  grafana,
  payload,
}: Pick<ILoggerOptions, 'grafana'> & {
  payload: ILogType['payload'];
  appKeyName?: string;
  appBranch?: string;
}): CallableFunction =>
  batcher((messages: Parameters<transportFunctionType>[0][], cb) => {
    const labels = {
      mobile: appKeyName,
      deployment: appBranch,
    };
    // sort messages by level
    const streams = messages.reduce((res, { level: { text: level }, msg, rawMsg }) => {
      if (!res[level]) {
        res[level] = {
          stream: {
            ...labels,
            level,
            error: level === 'error',
          },
          values: [],
        };
      }

      let message;

      try {
        message = JSON.stringify({ msg, rawMsg, ...payload });
      } catch (e) {
        message = `stringify error: ${e.message as string}`;
      }

      res[level].values.push([String(Date.now() * 1000000), message]);

      return res;
    }, {});

    void axios
      .request({
        url: `${grafana!.url}/loki/api/v1/push`,
        method: 'POST',
        headers: {
          Authorization: `Basic ${grafana!.token}`,
          'Content-Type': 'application/json',
        },
        data: { streams: Object.values(streams) },
      })
      .then(() => void cb())
      .catch((e) => {
        console.error('Error send grafana logs:', Object.values(e.response as Record<string, any>));
        cb();
      });
  });

const initLogger = ({ grafana, crashlytics, params = {} }: ILoggerOptions): ILogType => {
  /**
   * Log payload
   */
  const payload: ILogType['payload'] = { uuid: uuid.v4() };
  const setPayload: ILogType['setPayload'] = (key, value) => {
    payload[key] = value;
  };

  const appKeyName = Config.get('appKeyName');
  const appBranch = Config.get('appBranch');
  const isLocalDevelopment = Config.get('isLocalDevelopment');
  const isTests = Config.get('isTests');
  let grafanaTransport: CallableFunction | undefined;

  if (grafana) {
    grafanaTransport = grafanaLokiTransport({ appKeyName, appBranch, grafana, payload });
  }

  const config: configLoggerType = {
    enabled: !isTests,
    severity: isLocalDevelopment ? 'debug' : 'info',
    transport: (props) => {
      if (isLocalDevelopment) {
        consoleTransport(props);
      } else {
        // Production transport
        if (crashlytics) {
          firebaseCrashlyticsTransport(crashlytics, props);
        }

        if (grafanaTransport) {
          grafanaTransport(props);
        }
      }
    },
    transportOptions: isLocalDevelopment
      ? {
          colors: {
            info: 'blueBright',
            warn: 'yellowBright',
            error: 'redBright',
          },
        }
      : {
          colors: 'ansi',
        },
    levels: {
      trace: 0,
      debug: 1,
      info: 2,
      warn: 3,
      error: 4,
    },
    ...params,
  };

  const log = logger.createLogger(config) as unknown as ILogType;

  // extend log for adding some payload
  log.setPayload = setPayload;

  if (!Config.get('logger')) {
    Config.setup({ logger: log });
  }

  return log;
};

export default initLogger;
