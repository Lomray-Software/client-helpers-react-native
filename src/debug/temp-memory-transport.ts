import type { transportFunctionType } from 'react-native-logs';

type TMsg = Parameters<transportFunctionType>[0];

let memLogs: TMsg[] = [];
let resetTimerId: NodeJS.Timeout;

/**
 * Temp memory transport
 */
const tempMemoryTransport = (msg: TMsg): void => {
  memLogs.push(msg);
  clearTimeout(resetTimerId);

  /**
   * Cleanup logs every 2 min
   */
  resetTimerId = setTimeout(() => {
    memLogs = [];
  }, 60000 * 2);
};

export { memLogs, tempMemoryTransport };
