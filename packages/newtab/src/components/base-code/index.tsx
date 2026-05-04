import { useEffect, useMemo, useState } from 'react';
import { Modal } from '@arco-design/web-react';
import { Code2, Copy, FilePlus2, Save, Sparkles, Trash2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import prettier from 'prettier/standalone';
import babelPlugin from 'prettier/plugins/babel';
import estreePlugin from 'prettier/plugins/estree';
import htmlPlugin from 'prettier/plugins/html';
import markdownPlugin from 'prettier/plugins/markdown';
import postcssPlugin from 'prettier/plugins/postcss';
import typescriptPlugin from 'prettier/plugins/typescript';
import { useTranslation } from '@your-s-tools/i18n';
import type { YourToolApp } from '@your-s-tools/types';
import styles from './style.module.scss';

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
  return language;
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

export default function BaseCode() {
  const { t } = useTranslation();
  const defaultDisplayName = t('components.items.baseCode');
  const [visible, setVisible] = useState(false);
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
      const formatted = await prettier.format(activeSnippet.code, {
        parser,
        plugins: [babelPlugin, estreePlugin, htmlPlugin, markdownPlugin, postcssPlugin, typescriptPlugin],
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

  return (
    <>
      <div className={styles.launcherWrap}>
        <button
          type="button"
          className={styles.launcher}
          aria-label={t('code.open')}
          title={t('code.open')}
          onClick={() => setVisible(true)}
        >
          <span className={styles.launcherIcon}>
            <Code2 size={28} strokeWidth={2.2} />
          </span>
          <span className={styles.launcherText}>{activeDisplayName}</span>
        </button>
      </div>

      <Modal
        className={styles.modal}
        title={activeDisplayName}
        visible={visible}
        footer={null}
        unmountOnExit={false}
        onCancel={() => setVisible(false)}
      >
        <div className={styles.toolbar}>
          <div>
            <div className={styles.title}>{activeDisplayName}</div>
            <div className={styles.meta}>{snippetCountLabel}</div>
          </div>
          <div className={styles.toolbarActions}>
            <button type="button" className={styles.secondaryButton} onClick={copySnippet}>
              <Copy size={16} />
              <span>{t('code.copy')}</span>
            </button>
            <button type="button" className={styles.secondaryButton} onClick={formatSnippet}>
              <Sparkles size={16} />
              <span>{t('code.format')}</span>
            </button>
            <button type="button" className={styles.primaryButton} onClick={addSnippet}>
              <FilePlus2 size={16} />
              <span>{t('code.add')}</span>
            </button>
          </div>
        </div>

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

              <div className={styles.snippetActions}>
                {formatError && <span className={styles.meta}>{formatError}</span>}
                <button type="button" className={styles.dangerButton} onClick={deleteSnippet}>
                  <Trash2 size={16} />
                  <span>{t('code.delete')}</span>
                </button>
                <button type="button" className={styles.primaryButton} onClick={() => setVisible(false)}>
                  <Save size={16} />
                  <span>{t('code.done')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.empty}>{t('code.empty')}</div>
          )}
        </div>
      </Modal>
    </>
  );
}
