# Pack of common helpers for `React Native`

Reusable pieces from Lomray's React Native apps: navigation handlers, hooks, stores, UI components and service integrations. Use a specific helper when its dependencies match your app. This is not a drop-in cross-platform utility bundle: many modules require native services such as Firebase, Wix navigation or authentication SDKs.

## Installation and imports

```sh
npm install @lomray/client-helpers-react-native@3.6.0
```

Version 3.6.0 publishes individual module paths with adjacent declarations. Its manifest names `index.js` and `index.d.ts`, but neither root file is in the released tarball. Import the specific subpath; do not use a named import from the package root.

The package declares numerous peers in [package.json](./package.json). Installing one small helper does not make those native integrations optional in the package metadata. Check the chosen module's imports and configure its native dependencies in your app; this README does not establish compatibility across all declared peer ranges.

## Small state example

`SwitchStore` depends on MobX and starts with `isVisible = false`. `onOpen` and `onClose` are bound actions. No listener or native setup is involved in these two operations; install MobX in the consuming app.

<!-- docs-example: switch-store -->
```ts
import SwitchStore from '@lomray/client-helpers-react-native/stores/switch-store';

const dialog = new SwitchStore();
dialog.onOpen();
console.assert(dialog.isVisible === true);
dialog.onClose();
console.assert(dialog.isVisible === false);
```

These extensionless subpaths are intended for React Native's bundler. The package contains ES module syntax without a package-level `type: module`; direct execution in Node is not the supported path demonstrated here.

## Keyboard height in a component

<!-- docs-example: keyboard -->
```tsx
import React from 'react';
import { Text } from 'react-native';
import useKeyboardHeight from '@lomray/client-helpers-react-native/hooks/use-keyboard-height';

export default function KeyboardStatus() {
  const height = useKeyboardHeight();
  return <Text>Keyboard height: {height}</Text>;
}
```

The hook starts at zero, handles `keyboardDidShow`/`keyboardDidHide`, and removes both listeners on unmount. It reports keyboard event height, not a full keyboard-avoiding layout. Native keyboard delivery and layout behavior need testing on each supported platform.

For larger integrations, start with the relevant source: [navigation handlers](./src/navigation/helpers), [authentication helpers](./src/helpers/auth), [services](./src/services), and [components](./src/components). They have different setup requirements; there is no universal initialization call for the whole package.

![npm](https://img.shields.io/npm/v/@lomray/client-helpers-react-native)
![GitHub](https://img.shields.io/github/license/Lomray-Software/client-helpers-react-native)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=client-helpers-react-native&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=client-helpers-react-native)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=client-helpers-react-native&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=client-helpers-react-native)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=client-helpers-react-native&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=client-helpers-react-native)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=client-helpers-react-native&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=client-helpers-react-native)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=client-helpers-react-native&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=client-helpers-react-native)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=client-helpers-react-native&metric=coverage)](https://sonarcloud.io/summary/new_code?id=client-helpers-react-native)
