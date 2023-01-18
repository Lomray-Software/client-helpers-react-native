module.exports = {
  branches: [
    'prod',
    {
      name: 'staging',
      prerelease: 'beta',
      channel: 'beta',
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/github',
      {
        labels: false,
        releasedLabels: false,
        successComment: false,
        assets: [
          { path: 'ios/mobile.ipa', label: 'ios-${nextRelease.gitTag}' },
          { path: 'ios/mobile.app.dSYM.zip', label: 'ios-dsym-${nextRelease.gitTag}' },
          {
            path: 'android/app/build/outputs/bundle/release/app-release.aab',
            label: 'android-aab-${nextRelease.gitTag}',
          },
          {
            path: 'android/app/build/outputs/apk/release/app-release.apk',
            label: 'android-apk-${nextRelease.gitTag}',
          },
          {
            path: 'main.jsbundle.map',
            label: 'main-jsbundle-map-${nextRelease.gitTag}',
          },
        ],
      },
    ],
    [
      '@semantic-release/exec',
      {
        // This need for fastlane
        verifyReleaseCmd:
          "npx generate-release-config '<%= JSON.stringify(commits).replace(/'/g, '') %>' '${nextRelease.version}'",
      },
    ],
  ],
};
