import typescript from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { folderInput } from 'rollup-plugin-folder-input';
import { terser } from 'rollup-plugin-terser';
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
  external: ['axios', 'lodash'],
  plugins: [
    folderInput(),
    peerDepsExternal({
      includeDependencies: true,
    }),
    json(),
    typescript({
      transpiler: {
        typescriptSyntax: 'typescript',
        otherSyntax: 'babel'
      },
      babelConfig: {
        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript', '@babel/preset-flow'],
        plugins: [
          ['@babel/plugin-proposal-class-properties'],
        ]
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
    terser(),
    copy({
      targets: [
        { src: 'typings/**/*', dest: 'lib/typings' },
        { src: 'package.json', dest: 'lib' },
      ]
    })
  ],
};
