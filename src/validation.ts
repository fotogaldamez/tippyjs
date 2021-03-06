import {Targets} from './types';

export function createMemoryLeakWarning(method: string): string {
  const txt = method === 'destroy' ? 'n already-' : ' ';

  return [
    `${method}() was called on a${txt}destroyed instance. This is a no-op but`,
    'indicates a potential memory leak.',
  ].join(' ');
}

export function clean(value: string): string {
  const spacesAndTabs = /[ \t]{2,}/g;
  const lineStartWithSpaces = /^[ \t]*/gm;

  return value
    .replace(spacesAndTabs, ' ')
    .replace(lineStartWithSpaces, '')
    .trim();
}

function getDevMessage(message: string): string {
  return clean(`
  %ctippy.js

  %c${clean(message)}

  %c👷‍ This is a development-only message. It will be removed in production.
  `);
}

export function getFormattedMessage(message: string): string[] {
  return [
    getDevMessage(message),
    // title
    'color: #00C584; font-size: 1.3em; font-weight: bold;',
    // message
    'line-height: 1.5',
    // footer
    'color: #a6a095;',
  ];
}

/**
 * Helpful wrapper around `console.warn()`.
 * TODO: Should we use a cache so it only warns a single time and not spam the
 * console? (Need to consider hot reloading and invalidation though). Chrome
 * already batches warnings as well.
 */
export function warnWhen(condition: boolean, message: string): void {
  if (condition) {
    console.warn(...getFormattedMessage(message));
  }
}

/**
 * Helpful wrapper around `console.error()`
 */
export function errorWhen(condition: boolean, message: string): void {
  if (condition) {
    console.error(...getFormattedMessage(message));
  }
}

/**
 * Validates the `targets` value passed to `tippy()`
 */
export function validateTargets(targets: Targets): void {
  const didPassFalsyValue = !targets;
  const didPassPlainObject =
    Object.prototype.toString.call(targets) === '[object Object]' &&
    !(targets as any).addEventListener;

  errorWhen(
    didPassFalsyValue,
    [
      'tippy() was passed',
      '`' + String(targets) + '`',
      'as its targets (first) argument. Valid types are: String, Element,',
      'Element[], or NodeList.',
    ].join(' ')
  );

  errorWhen(
    didPassPlainObject,
    [
      'tippy() was passed a plain object which is not supported as an argument',
      'for virtual positioning. Use props.getReferenceClientRect instead.',
    ].join(' ')
  );
}
