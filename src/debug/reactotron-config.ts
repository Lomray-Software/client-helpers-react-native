/* eslint-disable */
import { NativeModules } from 'react-native'
import { ArgType } from 'reactotron-core-client'
import Reactotron from 'reactotron-react-native'
import MobxStoreManagerPlugin from "@lomray/reactotron-mobx-store-manager";

interface IConfig {
  isDebug: boolean;
  isTests?: boolean;
  AsyncStorage?: any;
}

/**
 * Init reactotron
 */
const init = ({ isDebug, AsyncStorage, isTests = false }: IConfig) => {
  if (isTests) {
    return {};
  }

  if (isDebug) {
    // @ts-ignore
    console.log = Reactotron.log  // for console.log in reactotron

    // For working on physic device
    const scriptURL = NativeModules.SourceCode.scriptURL || ''
    const domain = scriptURL.split('://')[1]

    if (domain) {
      Reactotron.configure({ host: domain.split(':')[0] })
    }
  }

  const reactotron = Reactotron
    .configure() // controls connection & communication settings
    .useReactNative() // add all built-in react native plugins
    .use(MobxStoreManagerPlugin())
    .connect() // let's connect!

  reactotron.setAsyncStorageHandler?.(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from

  // print async storage
  reactotron.onCustomCommand({
    command: 'showAsyncStorage',
    handler: () => {
      AsyncStorage.getAllKeys((_: never, keys: string[]) => {
        AsyncStorage.multiGet(keys, (__: never, stores: Record<string, any>[]) => {
          const result = {}

          stores.map((___: never, i: number, store: Record<string, any>) => {
            const [ n, v ] = store[i]

            result[n] = v
            result[`----${i}----`] = '-----------'
            return true
          })

          reactotron.logImportant?.(result)
        })
      })
    },

    title: 'Show AsyncStorage',
    description: 'Print async storage content',
  })

  // remove key from async storage
  reactotron.onCustomCommand({
    command: 'removeKeyAsyncStorage',
    handler: ({ key }) => {
      AsyncStorage.removeItem(key as string).then(() => {
        reactotron.logImportant?.(`Key ${key} removed!`)
      })
    },
    args: [
      {
        name: 'key',
        type: ArgType.String,
      },
    ],
    title: 'Remove key AsyncStorage',
    description: 'Remove key from async storage',
  })

  // reset timeline
  reactotron.clear?.();

  return reactotron;
}

export default init;
