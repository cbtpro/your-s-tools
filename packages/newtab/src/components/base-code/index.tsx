import { useEffect, useMemo, useState } from 'react';
import { Button, Divider, Space } from '@arco-design/web-react';
import { Code2, Copy, FilePlus2, Save, Sparkles, Trash2 } from 'lucide-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTranslation } from '@your-s-tools/i18n';
import type { YourToolApp } from '@your-s-tools/types';
import ToolModal from '../tool-modal';
import styles from './style.module.scss';

interface BaseCodeProps {
  variant?: 'launcher' | 'page';
  onClose?: () => void;
}

const storageKey = 'your-s-tools:code-snippets';

const languageOptions: YourToolApp.CodeSnippetLanguage[] = [
  'typescript',
  'javascript',
  'json',
  'css',
  'html',
  'markdown',
  'sql',
  'shell',
  'text',
];

SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('typescript', typescript);

const initialSnippet: YourToolApp.CodeSnippet = {
  id: 'welcome',
  title: 'React hook',
  language: 'typescript',
  code: `import { useMemo } from 'react';\n\nexport function useGreeting(name: string) {\n  return useMemo(() => ` + '`Hello ${name}`' + `, [name]);\n}\n`,
  updatedAt: Date.now(),
};

function createSnippet(): YourToolApp.CodeSnippet {
  return {
    id: `snippet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: 'Untitled snippet',
    language: 'typescript',
    code: '',
    updatedAt: Date.now(),
  };
}

function getParser(language: YourToolApp.CodeSnippetLanguage) {
  switch (language) {
    case 'typescript':
      return 'typescript';
    case 'javascript':
      return 'babel';
    case 'json':
      return 'json';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'markdown':
      return 'markdown';
    default:
      return null;
  }
}

function getSyntaxLanguage(language: YourToolApp.CodeSnippetLanguage) {
  if (language === 'shell') return 'bash';
  if (language === 'html') return 'markup';
  return language;
}

function getPrettierPluginLoaders(language: YourToolApp.CodeSnippetLanguage) {
  switch (language) {
    case 'typescript':
      return [() => import('prettier/plugins/typescript'), () => import('prettier/plugins/estree')];
    case 'javascript':
    case 'json':
      return [() => import('prettier/plugins/babel'), () => import('prettier/plugins/estree')];
    case 'css':
      return [() => import('prettier/plugins/postcss')];
    case 'html':
      return [() => import('prettier/plugins/html')];
    case 'markdown':
      return [() => import('prettier/plugins/markdown')];
    default:
      return [];
  }
}

function formatDate(value: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

async function getStoredState() {
  if (globalThis.chrome?.storage?.local) {
    const item = await globalThis.chrome.storage.local.get(storageKey);
    return item[storageKey] as YourToolApp.StoredCodeState | undefined;
  }

  const value = window.localStorage.getItem(storageKey);
  return value ? JSON.parse(value) as YourToolApp.StoredCodeState : undefined;
}

async function setStoredState(value: YourToolApp.StoredCodeState) {
  if (globalThis.chrome?.storage?.local) {
    await globalThis.chrome.storage.local.set({ [storageKey]: value });
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

export default function BaseCode({ variant = 'launcher', onClose }: BaseCodeProps = {}) {
  const { t } = useTranslation();
  const defaultDisplayName = t('components.items.baseCode');
  const [visible, setVisible] = useState(variant === 'page');
  const [displayName, setDisplayName] = useState('');
  const [snippets, setSnippets] = useState<YourToolApp.CodeSnippet[]>([initialSnippet]);
  const [activeId, setActiveId] = useState(initialSnippet.id);
  const [formatError, setFormatError] = useState('');
  const activeSnippet = snippets.find((snippet) => snippet.id === activeId) ?? snippets[0];
  const activeDisplayName = displayName.trim() || defaultDisplayName;

  useEffect(() => {
    getStoredState().then((storedState) => {
      if (!storedState) return;
      const nextSnippets = storedState.snippets.length ? storedState.snippets : [initialSnippet];
      setDisplayName(storedState.displayName ?? '');
      setSnippets(nextSnippets);
      setActiveId(storedState.activeId ?? nextSnippets[0].id);
    });
  }, []);

  useEffect(() => {
    setStoredState({
      displayName: displayName.trim() || undefined,
      snippets,
      activeId,
    });
  }, [activeId, displayName, snippets]);

  const updateSnippet = <K extends keyof YourToolApp.CodeSnippet>(key: K, value: YourToolApp.CodeSnippet[K]) => {
    if (!activeSnippet) return;
    setFormatError('');
    setSnippets((prev) => prev.map((snippet) => (
      snippet.id === activeSnippet.id
        ? { ...snippet, [key]: value, updatedAt: Date.now() }
        : snippet
    )));
  };

  const addSnippet = () => {
    const snippet = createSnippet();
    setSnippets((prev) => [snippet, ...prev]);
    setActiveId(snippet.id);
  };

  const deleteSnippet = () => {
    if (!activeSnippet) return;
    setSnippets((prev) => {
      const next = prev.filter((snippet) => snippet.id !== activeSnippet.id);
      const fallback = next[0] ?? createSnippet();
      setActiveId(fallback.id);
      return next.length ? next : [fallback];
    });
  };

  const copySnippet = () => {
    if (!activeSnippet) return;
    navigator.clipboard?.writeText(activeSnippet.code);
  };

  const formatSnippet = async () => {
    if (!activeSnippet) return;
    const parser = getParser(activeSnippet.language);
    if (!parser) {
      setFormatError(t('code.formatUnsupported'));
      return;
    }

    try {
      const [prettierModule, ...pluginModules] = await Promise.all([
        import('prettier/standalone'),
        ...getPrettierPluginLoaders(activeSnippet.language).map((loadPlugin) => loadPlugin()),
      ]);
      const formatted = await prettierModule.default.format(activeSnippet.code, {
        parser,
        plugins: pluginModules.map((pluginModule) => pluginModule.default),
        semi: true,
        singleQuote: true,
      });
      updateSnippet('code', formatted);
      setFormatError('');
    } catch {
      setFormatError(t('code.formatFailed'));
    }
  };

  const snippetCountLabel = useMemo(() => (
    t('code.snippetCount', { count: snippets.length })
  ), [snippets.length, t]);

  const openDetail = () => {
    if (variant === 'page') {
      setVisible(true);
      return;
    }

    window.dispatchEvent(new CustomEvent('your-s-tools:open-tool', { detail: 'code' }));
  };

  const closeDetail = () => {
    if (variant === 'page') {
      onClose?.();
      return;
    }

    setVisible(false);
  };

  return (
    <>
      {variant === 'launcher' && (
      <div className={styles.launcherWrap}>
        <button
          type="button"
          className={styles.launcher}
          aria-label={t('code.open')}
          title={t('code.open')}
          onClick={openDetail}
        >
          <span className={styles.launcherIcon}>
            <Code2 size={28} strokeWidth={2.2} />
          </span>
          <span className={styles.launcherText}>{activeDisplayName}</span>
        </button>
      </div>
      )}

      <ToolModal
        title={activeDisplayName}
        visible={visible}
        onCancel={closeDetail}
        header={(
          <div className={styles.toolbar}>
            <div>
              <div className={styles.title}>{activeDisplayName}</div>
              <div className={styles.meta}>{snippetCountLabel}</div>
            </div>
            <Space className={styles.toolbarActions} split={<Divider type="vertical" />}>
              <Button icon={<Copy size={16} />} onClick={copySnippet}>
                {t('code.copy')}
              </Button>
              <Button icon={<Sparkles size={16} />} onClick={formatSnippet}>
                {t('code.format')}
              </Button>
              <Button type="primary" icon={<FilePlus2 size={16} />} onClick={addSnippet}>
                {t('code.add')}
              </Button>
            </Space>
          </div>
        )}
        footer={activeSnippet ? (
          <Space className={styles.snippetActions} split={<Divider type="vertical" />}>
            {formatError && <span className={styles.meta}>{formatError}</span>}
            <Button status="danger" icon={<Trash2 size={16} />} onClick={deleteSnippet}>
              {t('code.delete')}
            </Button>
            <Button type="primary" icon={<Save size={16} />} onClick={closeDetail}>
              {t('code.done')}
            </Button>
          </Space>
        ) : null}
      >
        <div className={styles.workspace}>
          <div className={styles.sidebar}>
            <label className={styles.row}>
              <span className={styles.label}>{t('code.fields.displayName')}</span>
              <input
                className={styles.input}
                value={displayName}
                placeholder={defaultDisplayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </label>
            {snippets.map((snippet) => (
              <button
                key={snippet.id}
                type="button"
                className={`${styles.snippetItem} ${snippet.id === activeSnippet?.id ? styles.snippetItemActive : ''}`}
                onClick={() => setActiveId(snippet.id)}
              >
                <span className={styles.snippetTitle}>{snippet.title || t('code.untitled')}</span>
                <span className={styles.snippetMeta}>
                  {t(`code.languages.${snippet.language}`)} · {formatDate(snippet.updatedAt)}
                </span>
              </button>
            ))}
          </div>

          {activeSnippet ? (
            <div className={styles.editor}>
              <div className={styles.formGrid}>
                <label className={styles.row}>
                  <span className={styles.label}>{t('code.fields.title')}</span>
                  <input
                    className={styles.input}
                    value={activeSnippet.title}
                    onChange={(event) => updateSnippet('title', event.target.value)}
                  />
                </label>
                <label className={styles.row}>
                  <span className={styles.label}>{t('code.fields.language')}</span>
                  <select
                    className={styles.select}
                    value={activeSnippet.language}
                    onChange={(event) => updateSnippet('language', event.target.value as YourToolApp.CodeSnippetLanguage)}
                  >
                    {languageOptions.map((language) => (
                      <option key={language} value={language}>{t(`code.languages.${language}`)}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className={styles.row}>
                <span className={styles.label}>{t('code.fields.code')}</span>
                <textarea
                  className={styles.textarea}
                  value={activeSnippet.code}
                  spellCheck={false}
                  onChange={(event) => updateSnippet('code', event.target.value)}
                />
              </label>

              <div className={styles.preview}>
                <SyntaxHighlighter
                  language={getSyntaxLanguage(activeSnippet.language)}
                  style={oneLight}
                  showLineNumbers
                  wrapLongLines
                >
                  {activeSnippet.code || ' '}
                </SyntaxHighlighter>
              </div>
            </div>
          ) : (
            <div className={styles.empty}>{t('code.empty')}</div>
          )}
        </div>
      </ToolModal>
    </>
  );
}
