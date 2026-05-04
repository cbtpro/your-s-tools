import type { YourToolApp } from "@your-s-tools/types";

export type SearchEngineKey = 'google' | 'baidu' | 'bing' | 'duckduckgo' | 'github' | 'npm' | 'mdn';

export interface SearchEngine {
  key: SearchEngineKey;
  labelKey: string;
  prefix: string;
  aliases: string[];
  buildUrl: (query: string) => string;
}

const encodeQuery = (query: string) => encodeURIComponent(query.trim());

export const searchEngines: SearchEngine[] = [
  {
    key: 'google',
    labelKey: 'commandPalette.engines.google',
    prefix: 'g',
    aliases: ['google'],
    buildUrl: (query) => `https://www.google.com/search?q=${encodeQuery(query)}`,
  },
  {
    key: 'baidu',
    labelKey: 'commandPalette.engines.baidu',
    prefix: 'bd',
    aliases: ['baidu'],
    buildUrl: (query) => `https://www.baidu.com/s?wd=${encodeQuery(query)}`,
  },
  {
    key: 'bing',
    labelKey: 'commandPalette.engines.bing',
    prefix: 'b',
    aliases: ['bing'],
    buildUrl: (query) => `https://www.bing.com/search?q=${encodeQuery(query)}`,
  },
  {
    key: 'duckduckgo',
    labelKey: 'commandPalette.engines.duckduckgo',
    prefix: 'ddg',
    aliases: ['duckduckgo', 'duck'],
    buildUrl: (query) => `https://duckduckgo.com/?q=${encodeQuery(query)}`,
  },
  {
    key: 'github',
    labelKey: 'commandPalette.engines.github',
    prefix: 'gh',
    aliases: ['github'],
    buildUrl: (query) => `https://github.com/search?q=${encodeQuery(query)}`,
  },
  {
    key: 'npm',
    labelKey: 'commandPalette.engines.npm',
    prefix: 'npm',
    aliases: [],
    buildUrl: (query) => `https://www.npmjs.com/search?q=${encodeQuery(query)}`,
  },
  {
    key: 'mdn',
    labelKey: 'commandPalette.engines.mdn',
    prefix: 'mdn',
    aliases: [],
    buildUrl: (query) => `https://developer.mozilla.org/search?q=${encodeQuery(query)}`,
  },
];

export const defaultSearchEngine = searchEngines[0];

export function findSearchEngine(prefix: string) {
  const normalizedPrefix = prefix.toLowerCase();

  return searchEngines.find((engine) => (
    engine.prefix === normalizedPrefix ||
    engine.aliases.includes(normalizedPrefix)
  ));
}

export function parseSearchInput(input: string) {
  const trimmedInput = input.trim();
  const [prefix = '', ...queryParts] = trimmedInput.split(/\s+/);
  const prefixedEngine = findSearchEngine(prefix);

  if (prefixedEngine && queryParts.length > 0) {
    return {
      engine: prefixedEngine,
      query: queryParts.join(' '),
      usedPrefix: true,
    };
  }

  return {
    engine: defaultSearchEngine,
    query: trimmedInput,
    usedPrefix: false,
  };
}

export function openUrl(url: string, target: YourToolApp.SearchOpenTarget = 'newTab') {
  if (target === 'currentTab') {
    window.location.assign(url);
    return;
  }

  if (target === 'newWindow') {
    chrome.windows?.create?.({ url, type: 'normal' });
    return;
  }

  chrome.tabs?.create?.({ url });
}

export function openSearch(input: string, target: YourToolApp.SearchOpenTarget = 'newTab') {
  const parsedSearch = parseSearchInput(input);
  if (!parsedSearch.query) return;

  openUrl(parsedSearch.engine.buildUrl(parsedSearch.query), target);
}
