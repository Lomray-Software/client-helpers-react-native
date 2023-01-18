import typescript from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { folderInput } from 'rollup-plugin-folder-input';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
  input: [
    'src/**/*.ts*',
  ],
  output: {
    dir: 'lib',
    format: 'cjs',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src',
    exports: 'auto',
  },
  external: ['axios', 'lodash', 'react', 'react-native', 'mobx', 'reactotron-core-client'],
  plugins: [
    folderInput(),
    typescript({
      transpiler: {
        typescriptSyntax: 'typescript',
        otherSyntax: 'babel'
      },
      babelConfig: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react'
        ],
        plugins: [
          ['@babel/plugin-proposal-class-properties'],
          ['@babel/plugin-transform-runtime', {
            "absoluteRuntime": false,
          }],
        ],
      },
      tsconfig: resolvedConfig => ({
        ...resolvedConfig,
        declaration: true,
        importHelpers: true,
        plugins: [
          {
            "transform": "@zerollup/ts-transform-paths",
            "exclude": ["*"]
          }
        ]
      }),
    }),
    peerDepsExternal({
      includeDependencies: true,
    }),
    json(),
    terser({
      keep_classnames: true,
      keep_fnames: true,
    }),
    copy({
      targets: [
        { src: 'typings/**/*', dest: 'lib/typings' },
        { src: 'src/scripts/**/*', dest: 'lib/scripts' },
        { src: 'package.json', dest: 'lib' },
      ]
    })
  ],
};
