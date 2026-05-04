import { useEffect, useMemo, useState } from 'react';
import { Button, Divider, Space } from '@arco-design/web-react';
import { Copy, ExternalLink, Link as LinkIcon, Plus, Save, Star, Trash2 } from 'lucide-react';
import { useTranslation } from '@your-s-tools/i18n';
import type { YourToolApp } from '@your-s-tools/types';
import ToolModal from '../tool-modal';
import styles from './style.module.scss';

const storageKey = 'your-s-tools:links';

const initialLinks: YourToolApp.LinkItem[] = [
  {
    id: 'your-s-tools',
    title: '项目仓库',
    url: 'https://github.com',
    description: '管理项目代码、Issue 和常用开发资料。',
    tags: ['项目', '代码'],
    pinned: true,
    updatedAt: Date.now(),
  },
  {
    id: 'mdn',
    title: 'MDN Web 文档',
    url: 'https://developer.mozilla.org',
    description: '查询前端 API、HTML、CSS 和 JavaScript 文档。',
    tags: ['文档', '前端'],
    pinned: false,
    updatedAt: Date.now(),
  },
];

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^[a-z][a-z\d+.-]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function parseTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function formatTags(tags: string[]) {
  return tags.join(', ');
}

function createLink(): YourToolApp.LinkItem {
  return {
    id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: '新网址',
    url: 'https://example.com',
    iconUrl: '',
    description: '',
    tags: [],
    pinned: false,
    updatedAt: Date.now(),
  };
}

function getFaviconUrl(link: YourToolApp.LinkItem) {
  if (link.iconUrl?.trim()) return link.iconUrl.trim();

  const normalizedUrl = normalizeUrl(link.url);
  if (!normalizedUrl) return '';

  try {
    const { origin } = new URL(normalizedUrl);
    return `${origin}/favicon.ico`;
  } catch {
    return '';
  }
}

function sortLinks(links: YourToolApp.LinkItem[]) {
  return [...links].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });
}

async function getStoredState() {
  if (globalThis.chrome?.storage?.local) {
    const item = await globalThis.chrome.storage.local.get(storageKey);
    return item[storageKey] as YourToolApp.StoredLinkState | undefined;
  }

  const value = window.localStorage.getItem(storageKey);
  return value ? JSON.parse(value) as YourToolApp.StoredLinkState : undefined;
}

async function setStoredState(value: YourToolApp.StoredLinkState) {
  if (globalThis.chrome?.storage?.local) {
    await globalThis.chrome.storage.local.set({ [storageKey]: value });
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

export default function BaseLink() {
  const { t } = useTranslation();
  const defaultDisplayName = t('components.items.baseLink');
  const [visible, setVisible] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [links, setLinks] = useState<YourToolApp.LinkItem[]>(initialLinks);
  const [activeId, setActiveId] = useState(initialLinks[0].id);
  const [keyword, setKeyword] = useState('');
  const activeDisplayName = displayName.trim() || defaultDisplayName;
  const activeLink = links.find((link) => link.id === activeId) ?? links[0];

  useEffect(() => {
    getStoredState().then((storedState) => {
      if (!storedState) return;
      const nextLinks = storedState.links.length ? storedState.links : initialLinks;
      setDisplayName(storedState.displayName ?? '');
      setLinks(nextLinks);
      setActiveId(storedState.activeId ?? nextLinks[0].id);
    });
  }, []);

  useEffect(() => {
    setStoredState({
      displayName: displayName.trim() || undefined,
      links,
      activeId,
    });
  }, [activeId, displayName, links]);

  const filteredLinks = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const sorted = sortLinks(links);
    if (!normalizedKeyword) return sorted;

    return sorted.filter((link) => (
      link.title.toLowerCase().includes(normalizedKeyword) ||
      link.url.toLowerCase().includes(normalizedKeyword) ||
      link.description?.toLowerCase().includes(normalizedKeyword) ||
      link.tags.some((tag) => tag.toLowerCase().includes(normalizedKeyword))
    ));
  }, [keyword, links]);

  const updateLink = <K extends keyof YourToolApp.LinkItem>(key: K, value: YourToolApp.LinkItem[K]) => {
    if (!activeLink) return;
    setLinks((prev) => prev.map((link) => (
      link.id === activeLink.id
        ? { ...link, [key]: value, updatedAt: Date.now() }
        : link
    )));
  };

  const addLink = () => {
    const nextLink = createLink();
    setLinks((prev) => [nextLink, ...prev]);
    setActiveId(nextLink.id);
  };

  const deleteLink = () => {
    if (!activeLink) return;
    setLinks((prev) => {
      const next = prev.filter((link) => link.id !== activeLink.id);
      const fallback = next[0] ?? createLink();
      setActiveId(fallback.id);
      return next.length ? next : [fallback];
    });
  };

  const openLink = () => {
    if (!activeLink) return;
    const url = normalizeUrl(activeLink.url);
    if (!url) return;
    chrome.tabs?.create?.({ url });
  };

  const copyLink = () => {
    if (!activeLink) return;
    navigator.clipboard?.writeText(normalizeUrl(activeLink.url));
  };

  return (
    <>
      <div className={styles.launcherWrap}>
        <button
          type="button"
          className={styles.launcher}
          aria-label={t('link.open')}
          title={t('link.open')}
          onClick={() => setVisible(true)}
        >
          <span className={styles.launcherIcon}>
            <LinkIcon size={28} strokeWidth={2.2} />
          </span>
          <span className={styles.launcherText}>{activeDisplayName}</span>
        </button>
      </div>

      <ToolModal
        title={activeDisplayName}
        visible={visible}
        onCancel={() => setVisible(false)}
        header={(
          <div className={styles.toolbar}>
            <div>
              <div className={styles.title}>{activeDisplayName}</div>
              <div className={styles.meta}>{t('link.linkCount', { count: links.length })}</div>
            </div>
            <Space className={styles.toolbarActions} split={<Divider type="vertical" />}>
              <Button icon={<Copy size={16} />} onClick={copyLink}>
                {t('link.copy')}
              </Button>
              <Button icon={<ExternalLink size={16} />} onClick={openLink}>
                {t('link.visit')}
              </Button>
              <Button type="primary" icon={<Plus size={16} />} onClick={addLink}>
                {t('link.add')}
              </Button>
            </Space>
          </div>
        )}
        footer={activeLink ? (
          <Space className={styles.linkActions} split={<Divider type="vertical" />}>
            <Button
              icon={<Star size={16} fill={activeLink.pinned ? 'currentColor' : 'none'} />}
              onClick={() => updateLink('pinned', !activeLink.pinned)}
            >
              {activeLink.pinned ? t('link.unpin') : t('link.pin')}
            </Button>
            <Button status="danger" icon={<Trash2 size={16} />} onClick={deleteLink}>
              {t('link.delete')}
            </Button>
            <Button type="primary" icon={<Save size={16} />} onClick={() => setVisible(false)}>
              {t('link.done')}
            </Button>
          </Space>
        ) : null}
      >
        <div className={styles.workspace}>
          <div className={styles.sidebar}>
            <label className={styles.row}>
              <span className={styles.label}>{t('link.fields.displayName')}</span>
              <input
                className={styles.input}
                value={displayName}
                placeholder={defaultDisplayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </label>
            <label className={`${styles.row} ${styles.search}`}>
              <span className={styles.label}>{t('link.search')}</span>
              <input className={styles.input} value={keyword} onChange={(event) => setKeyword(event.target.value)} />
            </label>
            {filteredLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                className={`${styles.linkItem} ${link.id === activeLink?.id ? styles.linkItemActive : ''}`}
                onClick={() => setActiveId(link.id)}
              >
                <span className={styles.linkTitle}>
                  <span className={styles.linkTitleText}>
                    {getFaviconUrl(link) ? (
                      <img className={styles.favicon} src={getFaviconUrl(link)} alt="" />
                    ) : (
                      <LinkIcon className={styles.faviconFallback} size={16} />
                    )}
                    <span>{link.title || t('link.untitled')}</span>
                  </span>
                  {link.pinned && <Star className={styles.pin} size={14} fill="currentColor" />}
                </span>
                <span className={styles.linkUrl}>{normalizeUrl(link.url)}</span>
                {link.description && <span className={styles.linkDescription}>{link.description}</span>}
                {!!link.tags.length && (
                  <span className={styles.tags}>
                    {link.tags.map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
                  </span>
                )}
              </button>
            ))}
            {!filteredLinks.length && <div className={styles.empty}>{t('link.empty')}</div>}
          </div>

          {activeLink ? (
            <div className={styles.editor}>
              <div className={styles.formGrid}>
                <label className={styles.row}>
                  <span className={styles.label}>{t('link.fields.title')}</span>
                  <input className={styles.input} value={activeLink.title} onChange={(event) => updateLink('title', event.target.value)} />
                </label>
                <label className={styles.row}>
                  <span className={styles.label}>{t('link.fields.url')}</span>
                  <input className={styles.input} value={activeLink.url} onChange={(event) => updateLink('url', event.target.value)} />
                </label>
              </div>
              <label className={styles.row}>
                <span className={styles.label}>{t('link.fields.iconUrl')}</span>
                <input className={styles.input} value={activeLink.iconUrl ?? ''} placeholder={getFaviconUrl({ ...activeLink, iconUrl: '' })} onChange={(event) => updateLink('iconUrl', event.target.value)} />
              </label>
              <label className={styles.row}>
                <span className={styles.label}>{t('link.fields.description')}</span>
                <textarea className={styles.textarea} value={activeLink.description ?? ''} onChange={(event) => updateLink('description', event.target.value)} />
              </label>
              <label className={styles.row}>
                <span className={styles.label}>{t('link.fields.tags')}</span>
                <input className={styles.input} value={formatTags(activeLink.tags)} onChange={(event) => updateLink('tags', parseTags(event.target.value))} />
              </label>
              <div className={styles.preview}>
                <div className={styles.previewTitle}>
                  {getFaviconUrl(activeLink) ? (
                    <img className={styles.previewFavicon} src={getFaviconUrl(activeLink)} alt="" />
                  ) : (
                    <LinkIcon className={styles.previewFaviconFallback} size={22} />
                  )}
                  <span>{activeLink.title || t('link.untitled')}</span>
                </div>
                <div className={styles.previewUrl}>{normalizeUrl(activeLink.url)}</div>
                {activeLink.description && <div className={styles.linkDescription}>{activeLink.description}</div>}
                {!!activeLink.tags.length && (
                  <div className={styles.tags}>
                    {activeLink.tags.map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.empty}>{t('link.empty')}</div>
          )}
        </div>
      </ToolModal>
    </>
  );
}
