#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');

const [, , commitsRaw, nextReleaseVersion] = process.argv;

const commits = JSON.parse(commitsRaw);
const notes = {
  ios: {
    feat: new Set(),
    fix: new Set(),
    perf: new Set(),
  },
  android: {
    feat: new Set(),
    fix: new Set(),
    perf: new Set(),
  },
  all: {
    feat: new Set(),
    fix: new Set(),
    perf: new Set(),
  },
};

/**
 * Find scope in commit subject message
 */
const findScope = (scopeName, note) =>
  // find by scope name
  note.includes(`feat(${scopeName}`) ||
  note.includes(`fix(${scopeName}`) ||
  note.includes(`perf(${scopeName}`);

/**
 * Add release note to stack
 */
const addNote = (subject, scopeName) => {
  const { groups } = /(?<type>[^()]+)(?<scope>\(.+\))?: (?<message>.+)/.exec(subject) ?? {};

  if (!groups) {
    return;
  }

  const { type, message } = groups;
  const scope = groups.scope?.replace(/[()]/g, '').replace(new RegExp(`${scopeName}-?`), '');

  if (!type || !message) {
    console.info('Unrecognized commit subject: ', subject);

    return;
  }

  if (notes[scopeName][type]) {
    notes[scopeName][type].add(scope ? `${scope}: ${message}` : message);
  }
};

/**
 * Sort commits
 */
commits.forEach(({ subject }) => {
  if (findScope('android', subject)) {
    return addNote(subject, 'android');
  } else if (findScope('ios', subject)) {
    return addNote(subject, 'ios');
  }

  return addNote(subject, 'all');
});

/**
 * Generate release notes for android/ios
 */
const generateNote = (scopeName) => {
  const { feat: featScope, fix: fixScope, perf: perfScope } = notes[scopeName];
  const { feat: featGlobal, fix: fixGlobal, perf: perfGlobal } = notes.all;

  const feat = [...featScope, ...featGlobal];
  const fix = [...fixScope, ...fixGlobal];
  const perf = [...perfScope, ...perfGlobal];

  let note = '';

  const addScopeBlock = (block, name) => {
    if (block.length === 0) {
      return;
    }

    if (note.length > 0) {
      note += `\n\n`;
    }

    note += `### ${name}:\n\n`;

    block.forEach((msg) => {
      note += `* ${msg}\n`;
    });
  };

  addScopeBlock(feat, 'Features');
  addScopeBlock(fix, 'Bug Fixes');
  addScopeBlock(perf, 'Performance');

  if (note.length > 0) {
    const [date] = new Date().toISOString().split('T');

    note = `# ${nextReleaseVersion} (${date})\n\n${note}\n`;
  }

  return note;
};

const androidNotes = generateNote('android');
const iosNotes = generateNote('ios');

const result = {
  nextReleaseVersion: nextReleaseVersion.split('-')[0],
  shouldIosRelease: iosNotes.length > 0,
  shouldAndroidRelease: androidNotes.length > 0,
  androidNotes,
  iosNotes,
};

const cwd = process.cwd();
let outputFolder = cwd;

if (cwd.indexOf('/ios/') !== -1) {
  outputFolder = cwd.split('/ios/')[0];
} else if (cwd.indexOf('/android/')) {
  outputFolder = cwd.split('/android/')[0];
} else if (cwd.indexOf('/node_modules/')) {
  outputFolder = cwd.split('/node_modules/')[0];
}

// write result (project root)
fs.writeFileSync(`${outputFolder}/release.json`, JSON.stringify(result), 'utf8');
