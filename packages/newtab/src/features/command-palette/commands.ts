import type { NavigateFunction } from 'react-router-dom';
import type { YourToolApp } from '@your-s-tools/types';
import { defaultSearchEngine, openUrl, parseSearchInput, searchEngines, type SearchEngine } from './search-engines';

export type CommandKind = 'navigation' | 'search';

export interface CommandAction {
  id: string;
  kind: CommandKind;
  titleKey?: string;
  title?: string;
  descriptionKey: string;
  shortcut?: string;
  engine?: SearchEngine;
  run: () => void;
}

interface CreateCommandsParams {
  input: string;
  navigate: NavigateFunction;
  searchOpenTarget: YourToolApp.SearchOpenTarget;
}

const navigationCommands = [
  {
    id: 'go-home',
    titleKey: 'commandPalette.commands.home',
    descriptionKey: 'commandPalette.descriptions.home',
    path: '/',
  },
  {
    id: 'go-layout-edit',
    titleKey: 'commandPalette.commands.layoutEdit',
    descriptionKey: 'commandPalette.descriptions.layoutEdit',
    path: '/layout-edit',
  },
  {
    id: 'go-settings',
    titleKey: 'commandPalette.commands.settings',
    descriptionKey: 'commandPalette.descriptions.settings',
    path: '/settings',
  },
  {
    id: 'go-about',
    titleKey: 'commandPalette.commands.about',
    descriptionKey: 'commandPalette.descriptions.about',
    path: '/about',
  },
];

function openSearchUrl(engine: SearchEngine, query: string, target: YourToolApp.SearchOpenTarget) {
  if (!query.trim()) return;
  openUrl(engine.buildUrl(query), target);
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function createCommands({ input, navigate, searchOpenTarget }: CreateCommandsParams): CommandAction[] {
  const normalizedInput = normalizeText(input);
  const parsedSearch = parseSearchInput(input);
  const commands: CommandAction[] = [];

  if (parsedSearch.query) {
    commands.push({
      id: `search-${parsedSearch.engine.key}`,
      kind: 'search',
      title: parsedSearch.query,
      descriptionKey: parsedSearch.usedPrefix
        ? 'commandPalette.descriptions.prefixedSearch'
        : 'commandPalette.descriptions.defaultSearch',
      shortcut: parsedSearch.engine.prefix,
      engine: parsedSearch.engine,
      run: () => openSearchUrl(parsedSearch.engine, parsedSearch.query, searchOpenTarget),
    });
  }

  if (!parsedSearch.usedPrefix) {
    searchEngines
      .filter((engine) => engine.key !== parsedSearch.engine.key)
      .filter((engine) => !normalizedInput || engine.prefix.includes(normalizedInput) || engine.key.includes(normalizedInput))
      .forEach((engine) => {
        commands.push({
          id: `engine-${engine.key}`,
          kind: 'search',
          titleKey: engine.labelKey,
          descriptionKey: 'commandPalette.descriptions.engineHint',
          shortcut: engine.prefix,
          engine,
          run: () => openSearchUrl(engine, input, searchOpenTarget),
        });
      });
  }

  navigationCommands
    .filter((command) => !normalizedInput || command.id.includes(normalizedInput) || command.path.includes(normalizedInput))
    .forEach((command) => {
      commands.push({
        id: command.id,
        kind: 'navigation',
        titleKey: command.titleKey,
        descriptionKey: command.descriptionKey,
        run: () => navigate(command.path),
      });
    });

  if (!commands.length && input.trim()) {
    commands.push({
      id: 'search-fallback',
      kind: 'search',
      title: input.trim(),
      descriptionKey: 'commandPalette.descriptions.defaultSearch',
      shortcut: defaultSearchEngine.prefix,
      engine: defaultSearchEngine,
      run: () => openSearchUrl(defaultSearchEngine, input, searchOpenTarget),
    });
  }

  return commands;
}
