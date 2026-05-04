import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Divider, Space } from '@arco-design/web-react';
import QRCode from 'qrcode';
import { Edit3, History, QrCode, Save, Trash2 } from 'lucide-react';
import { useTranslation } from '@your-s-tools/i18n';
import type { YourToolApp } from '@your-s-tools/types';
import ToolModal from '../tool-modal';
import styles from './style.module.scss';

type QrcodeMode = 'display' | 'edit';
interface BaseQrcodeProps {
  variant?: 'launcher' | 'page';
  onClose?: () => void;
}
type RuntimeHistoryItem = Omit<YourToolApp.QrcodeHistoryItem, 'form'> & {
  form: YourToolApp.QrcodeFormState;
};
type RuntimeHistory = Partial<Record<YourToolApp.QrcodeProtocol, RuntimeHistoryItem[]>>;
interface RuntimeQrcodeState {
  displayName?: string;
  current?: YourToolApp.QrcodeFormState;
  history: RuntimeHistory;
  savedAt?: number;
}

const storageKey = 'your-s-tools:qrcode-form';
const cryptoPurpose = 'your-s-tools:qrcode:wifi-password';
const maxHistoryPerProtocol = 8;

const initialForm: YourToolApp.QrcodeFormState = {
  protocol: 'url',
  text: 'Hello Your\'s Tools',
  url: 'https://example.com',
  ssid: 'SZ-WLAN（深 i 网）',
  password: '',
  encryption: 'WPA',
  hidden: false,
  email: 'hello@your-s-tools.dev',
  subject: 'Your\'s Tools feedback',
  body: 'Hi, I am trying the QR code component.',
  phone: '+8613800138000',
  smsMessage: 'Remember to review Your\'s Tools today.',
  name: 'Your\'s Tools',
  latitude: '31.2304',
  longitude: '121.4737',
  eventTitle: 'Your\'s Tools Review',
  eventLocation: 'Shanghai',
  eventStart: '2026-05-04T09:00',
  eventEnd: '2026-05-04T10:00',
};

const protocolOptions: YourToolApp.QrcodeProtocol[] = ['url', 'text', 'wifi', 'email', 'phone', 'sms', 'vcard', 'geo', 'event'];

function escapeWifi(value: string) {
  return value.replace(/([\\;,":])/g, '\\$1');
}

function withUrlScheme(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^[a-z][a-z\d+.-]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function buildMailto(email: string, subject: string, body: string) {
  const params = new URLSearchParams();
  if (subject.trim()) params.set('subject', subject.trim());
  if (body.trim()) params.set('body', body.trim());
  const query = params.toString();
  return `mailto:${email.trim()}${query ? `?${query}` : ''}`;
}

function formatEventDate(value: string) {
  if (!value.trim()) return '';
  return value.replace(/[-:]/g, '').replace('T', 'T').slice(0, 15);
}

function bufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

function base64ToBuffer(value: string) {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
}

async function createStorageKey(salt: Uint8Array) {
  const runtimeId = globalThis.chrome?.runtime?.id ?? window.location.origin;
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(`${runtimeId}:${cryptoPurpose}`),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 120000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function encryptPassword(password: string): Promise<YourToolApp.EncryptedValue | undefined> {
  if (!password) return undefined;

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await createStorageKey(salt);
  const cipherText = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(password),
  );

  return {
    cipherText: bufferToBase64(cipherText),
    iv: bufferToBase64(iv.buffer),
    salt: bufferToBase64(salt.buffer),
  };
}

async function decryptPassword(encryptedPassword?: YourToolApp.EncryptedValue) {
  if (!encryptedPassword) return '';

  const salt = new Uint8Array(base64ToBuffer(encryptedPassword.salt));
  const iv = new Uint8Array(base64ToBuffer(encryptedPassword.iv));
  const key = await createStorageKey(salt);
  const plainText = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    base64ToBuffer(encryptedPassword.cipherText),
  );

  return new TextDecoder().decode(plainText);
}

async function serializeForm(form: YourToolApp.QrcodeFormState): Promise<YourToolApp.StoredQrcodeFormState> {
  const { password, ...safeForm } = form;
  return {
    ...safeForm,
    encryptedPassword: await encryptPassword(password),
  };
}

async function parseStoredForm(storedForm: YourToolApp.StoredQrcodeFormState): Promise<YourToolApp.QrcodeFormState> {
  const password = await decryptPassword(storedForm.encryptedPassword);
  const form: Partial<YourToolApp.QrcodeFormState> = {
    ...storedForm,
    password,
  };
  delete (form as Partial<YourToolApp.StoredQrcodeFormState>).encryptedPassword;
  return { ...initialForm, ...form, password };
}

async function serializeState(state: RuntimeQrcodeState): Promise<YourToolApp.StoredQrcodeState> {
  const historyEntries = await Promise.all(
    protocolOptions.map(async (protocol) => {
      const items = state.history[protocol] ?? [];
      const storedItems = await Promise.all(items.map(async (item) => ({
        ...item,
        form: await serializeForm(item.form),
      })));
      return [protocol, storedItems] as const;
    }),
  );

  return {
    displayName: state.displayName,
    current: state.current ? await serializeForm(state.current) : undefined,
    history: Object.fromEntries(historyEntries),
    savedAt: state.savedAt,
  };
}

async function parseStoredState(value: string | null): Promise<RuntimeQrcodeState | null> {
  if (!value) return null;

  const stored = JSON.parse(value) as YourToolApp.StoredQrcodeState | YourToolApp.StoredQrcodeFormState;
  if ('protocol' in stored) {
    const form = await parseStoredForm(stored);
    return {
      current: form,
      history: addHistoryItem({}, form),
      savedAt: Date.now(),
    };
  }

  const historyEntries = await Promise.all(
    protocolOptions.map(async (protocol) => {
      const items = stored.history?.[protocol] ?? [];
      const parsedItems = await Promise.all(items.map(async (item) => ({
        ...item,
        form: await parseStoredForm(item.form),
      })));
      return [protocol, parsedItems] as const;
    }),
  );

  return {
    displayName: stored.displayName,
    current: stored.current ? await parseStoredForm(stored.current) : undefined,
    history: Object.fromEntries(historyEntries),
    savedAt: stored.savedAt,
  };
}

async function getStoredFormValue() {
  if (globalThis.chrome?.storage?.local) {
    const item = await globalThis.chrome.storage.local.get(storageKey);
    return typeof item[storageKey] === 'string' ? item[storageKey] : null;
  }

  return window.localStorage.getItem(storageKey);
}

async function setStoredFormValue(value: string) {
  if (globalThis.chrome?.storage?.local) {
    await globalThis.chrome.storage.local.set({ [storageKey]: value });
    return;
  }

  window.localStorage.setItem(storageKey, value);
}

async function removeStoredFormValue() {
  if (globalThis.chrome?.storage?.local) {
    await globalThis.chrome.storage.local.remove(storageKey);
  }

  window.localStorage.removeItem(storageKey);
}

function buildPayload(form: YourToolApp.QrcodeFormState) {
  switch (form.protocol) {
    case 'url':
      return withUrlScheme(form.url);
    case 'wifi':
      return `WIFI:T:${form.encryption};S:${escapeWifi(form.ssid)};P:${escapeWifi(form.password)};H:${form.hidden ? 'true' : 'false'};;`;
    case 'email':
      return buildMailto(form.email, form.subject, form.body);
    case 'phone':
      return `tel:${form.phone.trim()}`;
    case 'sms':
      return `SMSTO:${form.phone.trim()}:${form.smsMessage.trim()}`;
    case 'vcard':
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${form.name.trim() || form.email.trim() || form.phone.trim()}`,
        form.phone.trim() ? `TEL:${form.phone.trim()}` : '',
        form.email.trim() ? `EMAIL:${form.email.trim()}` : '',
        'END:VCARD',
      ].filter(Boolean).join('\n');
    case 'geo':
      return `geo:${form.latitude.trim()},${form.longitude.trim()}`;
    case 'event':
      return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${form.eventTitle.trim()}`,
        form.eventLocation.trim() ? `LOCATION:${form.eventLocation.trim()}` : '',
        form.eventStart.trim() ? `DTSTART:${formatEventDate(form.eventStart)}` : '',
        form.eventEnd.trim() ? `DTEND:${formatEventDate(form.eventEnd)}` : '',
        'END:VEVENT',
        'END:VCALENDAR',
      ].filter(Boolean).join('\n');
    default:
      return form.text;
  }
}

function getFormLabel(form: YourToolApp.QrcodeFormState) {
  switch (form.protocol) {
    case 'url':
      return form.url.trim() || 'URL';
    case 'text':
      return form.text.trim().split('\n')[0] || 'Text';
    case 'wifi':
      return form.ssid.trim() || 'Wi-Fi';
    case 'email':
      return form.email.trim() || 'Email';
    case 'phone':
      return form.phone.trim() || 'Phone';
    case 'sms':
      return form.phone.trim() || 'SMS';
    case 'vcard':
      return form.name.trim() || form.email.trim() || 'Contact';
    case 'geo':
      return `${form.latitude.trim()}, ${form.longitude.trim()}`;
    case 'event':
      return form.eventTitle.trim() || 'Event';
    default:
      return form.protocol;
  }
}

function createHistoryId(form: YourToolApp.QrcodeFormState) {
  return `${form.protocol}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function addHistoryItem(history: RuntimeHistory, form: YourToolApp.QrcodeFormState): RuntimeHistory {
  const label = getFormLabel(form);
  const protocolHistory = history[form.protocol] ?? [];
  const deduped = protocolHistory.filter((item) => buildPayload(item.form) !== buildPayload(form));
  const nextItem: RuntimeHistoryItem = {
    id: createHistoryId(form),
    protocol: form.protocol,
    label,
    createdAt: Date.now(),
    form,
  };

  return {
    ...history,
    [form.protocol]: [nextItem, ...deduped].slice(0, maxHistoryPerProtocol),
  };
}

function createEmptyForm(protocol: YourToolApp.QrcodeProtocol): YourToolApp.QrcodeFormState {
  return {
    protocol,
    text: '',
    url: '',
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
    email: '',
    subject: '',
    body: '',
    phone: '',
    smsMessage: '',
    name: '',
    latitude: '',
    longitude: '',
    eventTitle: '',
    eventLocation: '',
    eventStart: '',
    eventEnd: '',
  };
}

function formatSavedTime(value?: number) {
  if (!value) return '';
  return new Intl.DateTimeFormat(undefined, {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

export default function BaseQrcode({ variant = 'launcher', onClose }: BaseQrcodeProps = {}) {
  const { t } = useTranslation();
  const defaultDisplayName = t('components.items.baseQrcode');
  const [form, setForm] = useState<YourToolApp.QrcodeFormState>(initialForm);
  const [savedForm, setSavedForm] = useState<YourToolApp.QrcodeFormState | null>(null);
  const [history, setHistory] = useState<RuntimeHistory>({});
  const [displayName, setDisplayName] = useState('');
  const [draftDisplayName, setDraftDisplayName] = useState('');
  const [mode, setMode] = useState<QrcodeMode>('edit');
  const [savedAt, setSavedAt] = useState<number>();
  const [qrImage, setQrImage] = useState('');
  const [visible, setVisible] = useState(variant === 'page');
  const [hoverPreviewVisible, setHoverPreviewVisible] = useState(false);
  const loadedRef = useRef(false);
  const hoverPreviewTimerRef = useRef<number | undefined>(undefined);
  const activeForm = mode === 'display' && savedForm ? savedForm : form;
  const activeDisplayName = (mode === 'display' ? displayName : draftDisplayName).trim() || defaultDisplayName;
  const payload = useMemo(() => buildPayload(activeForm), [activeForm]);
  const currentHistory = history[form.protocol] ?? [];

  useEffect(() => {
    let active = true;

    getStoredFormValue()
      .then((value) => parseStoredState(value))
      .then((storedState) => {
        if (!active || !storedState?.current) return;
        setForm(storedState.current);
        setSavedForm(storedState.current);
        setHistory(storedState.history);
        setDisplayName(storedState.displayName ?? '');
        setDraftDisplayName(storedState.displayName ?? '');
        setSavedAt(storedState.savedAt);
        setMode('display');
      })
      .catch(() => {
        removeStoredFormValue();
      })
      .finally(() => {
        if (active) loadedRef.current = true;
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!payload) {
      setQrImage('');
      return;
    }

    QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      margin: 2,
      scale: 8,
      color: {
        dark: '#111827',
        light: '#ffffff',
      },
    })
      .then((dataUrl) => {
        if (active) setQrImage(dataUrl);
      })
      .catch(() => {
        if (active) setQrImage('');
      });

    return () => {
      active = false;
    };
  }, [payload]);

  useEffect(() => () => {
    if (hoverPreviewTimerRef.current) {
      window.clearTimeout(hoverPreviewTimerRef.current);
    }
  }, []);

  const updateForm = <K extends keyof YourToolApp.QrcodeFormState>(key: K, value: YourToolApp.QrcodeFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const changeProtocol = (protocol: YourToolApp.QrcodeProtocol) => {
    setHistory((prev) => {
      const nextHistory = addHistoryItem(prev, form);
      const latest = nextHistory[protocol]?.[0]?.form;
      setForm({ ...(latest ?? initialForm), protocol });
      return nextHistory;
    });
  };

  const restoreHistoryItem = (item: RuntimeHistoryItem) => {
    setForm(item.form);
  };

  const persistHistory = (nextHistory: RuntimeHistory) => {
    if (!loadedRef.current) return;

    serializeState({
      displayName: displayName.trim() || undefined,
      current: savedForm ?? undefined,
      history: nextHistory,
      savedAt,
    })
      .then((storedState) => setStoredFormValue(JSON.stringify(storedState)))
      .catch(() => {
        removeStoredFormValue();
      });
  };

  const deleteHistoryItem = (item: RuntimeHistoryItem) => {
    if (mode === 'edit' && form.protocol === item.protocol && buildPayload(form) === buildPayload(item.form)) {
      setForm(createEmptyForm(item.protocol));
    }

    setHistory((prev) => {
      const nextHistory = {
        ...prev,
        [item.protocol]: (prev[item.protocol] ?? []).filter((historyItem) => historyItem.id !== item.id),
      };
      persistHistory(nextHistory);
      return nextHistory;
    });
  };

  const saveForm = () => {
    if (!loadedRef.current) return;
    const nextHistory = addHistoryItem(history, form);
    const nextSavedAt = Date.now();
    const nextDisplayName = draftDisplayName.trim();
    const nextState: RuntimeQrcodeState = {
      displayName: nextDisplayName || undefined,
      current: form,
      history: nextHistory,
      savedAt: nextSavedAt,
    };

    serializeState(nextState)
      .then((storedState) => setStoredFormValue(JSON.stringify(storedState)))
      .then(() => {
        setHistory(nextHistory);
        setSavedForm(form);
        setDisplayName(nextDisplayName);
        setDraftDisplayName(nextDisplayName);
        setSavedAt(nextSavedAt);
        setMode('display');
      })
      .catch(() => {
        removeStoredFormValue();
      });
  };

  const copyPayload = () => {
    navigator.clipboard?.writeText(payload);
  };

  const showHoverPreview = () => {
    if (!qrImage) return;
    hoverPreviewTimerRef.current = window.setTimeout(() => {
      setHoverPreviewVisible(true);
    }, 300);
  };

  const hideHoverPreview = () => {
    if (hoverPreviewTimerRef.current) {
      window.clearTimeout(hoverPreviewTimerRef.current);
      hoverPreviewTimerRef.current = undefined;
    }
    setHoverPreviewVisible(false);
  };

  const startEdit = () => {
    setForm(savedForm ?? form);
    setDraftDisplayName(displayName);
    setMode('edit');
  };

  const cancelEdit = () => {
    if (savedForm) {
      setForm(savedForm);
      setDraftDisplayName(displayName);
      setMode('display');
      return;
    }

    setMode('edit');
  };

  const openDetail = () => {
    if (variant === 'page') {
      setVisible(true);
      return;
    }

    window.dispatchEvent(new CustomEvent('your-s-tools:open-tool', { detail: 'qrcode' }));
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
      <div className={styles.launcherWrap} onMouseEnter={showHoverPreview} onMouseLeave={hideHoverPreview}>
        <button
          type="button"
          className={styles.launcher}
          aria-label={t('qrcode.open')}
          title={t('qrcode.open')}
          onFocus={showHoverPreview}
          onBlur={hideHoverPreview}
          onClick={openDetail}
        >
          <span className={styles.launcherIcon}>
            <QrCode size={28} strokeWidth={2.2} />
          </span>
          <span className={styles.launcherText}>{activeDisplayName}</span>
        </button>
        {hoverPreviewVisible && qrImage && (
          <div className={styles.hoverPreview} role="presentation">
            <img src={qrImage} alt={activeDisplayName} />
          </div>
        )}
      </div>
      )}

      <ToolModal
        title={activeDisplayName}
        visible={visible}
        onCancel={closeDetail}
        header={(
          <div className={styles.toolbar}>
            <div className={styles.titleGroup}>
              <div className={styles.modeTitle}>
                {activeDisplayName}
              </div>
              <div className={styles.modeMeta}>
                {mode === 'display'
                  ? t('qrcode.displayMode')
                  : t('qrcode.editMode')}
                {' · '}
                {savedForm ? t('qrcode.savedAt', { time: formatSavedTime(savedAt) }) : t('qrcode.unsaved')}
              </div>
            </div>
            <Space className={styles.toolbarActions} split={<Divider type="vertical" />}>
              {mode === 'display' ? [
                <Button key="edit" type="primary" icon={<Edit3 size={16} />} onClick={startEdit}>
                  {t('qrcode.edit')}
                </Button>,
              ] : [
                <Button key="cancel" disabled={!savedForm} onClick={cancelEdit}>
                  {t('qrcode.cancelEdit')}
                </Button>,
                <Button key="save" type="primary" icon={<Save size={16} />} onClick={saveForm}>
                  {t('qrcode.save')}
                </Button>,
              ]}
            </Space>
          </div>
        )}
        footer={(
          <Space className={styles.actions} split={<Divider type="vertical" />}>
            <Button type="primary" onClick={copyPayload}>
              {t('qrcode.copy')}
            </Button>
          </Space>
        )}
      >
        <div className={styles.qrcode}>
          <div className={styles.preview}>
            <div className={styles.qrImage}>
              {qrImage && <img src={qrImage} alt={activeDisplayName} />}
            </div>
            {!qrImage && <div className={styles.error}>{t('qrcode.unavailable')}</div>}
            <div className={styles.payload} title={payload}>{payload}</div>
          </div>

          {mode === 'display' ? (
            <div className={styles.summary}>
              <div className={styles.summaryLabel}>{t('qrcode.protocol')}</div>
              <div className={styles.summaryValue}>{t(`qrcode.protocols.${activeForm.protocol}`)}</div>
              <div className={styles.summaryLabel}>{t('qrcode.currentContent')}</div>
              <div className={styles.summaryValue}>{getFormLabel(activeForm)}</div>
            </div>
          ) : (
            <div className={styles.form}>
              <label className={styles.row}>
                <span className={styles.label}>{t('qrcode.fields.displayName')}</span>
                <input
                  className={styles.input}
                  value={draftDisplayName}
                  placeholder={defaultDisplayName}
                  onChange={(event) => setDraftDisplayName(event.target.value)}
                />
              </label>

              <label className={styles.row}>
                <span className={styles.label}>{t('qrcode.protocol')}</span>
                <select
                  className={styles.select}
                  value={form.protocol}
                  onChange={(event) => changeProtocol(event.target.value as YourToolApp.QrcodeProtocol)}
                >
                  {protocolOptions.map((protocol) => (
                    <option key={protocol} value={protocol}>
                      {t(`qrcode.protocols.${protocol}`)}
                    </option>
                  ))}
                </select>
              </label>

              {currentHistory.length > 0 && (
                <div className={styles.history}>
                  <div className={styles.historyHeader}>
                    <History size={14} />
                    <span>{t('qrcode.history')}</span>
                  </div>
                  <div className={styles.historyList}>
                    {currentHistory.map((item) => (
                      <div key={item.id} className={styles.historyItem}>
                        <button type="button" className={styles.historyRestore} onClick={() => restoreHistoryItem(item)}>
                          <span>{item.label}</span>
                          <small>{formatSavedTime(item.createdAt)}</small>
                        </button>
                        <button
                          type="button"
                          className={styles.historyDelete}
                          aria-label={t('qrcode.deleteHistory')}
                          title={t('qrcode.deleteHistory')}
                          onClick={() => deleteHistoryItem(item)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {form.protocol === 'text' && (
                <label className={styles.row}>
                  <span className={styles.label}>{t('qrcode.fields.text')}</span>
                  <textarea className={styles.textarea} value={form.text} onChange={(event) => updateForm('text', event.target.value)} />
                </label>
              )}

              {form.protocol === 'url' && (
                <label className={styles.row}>
                  <span className={styles.label}>{t('qrcode.fields.url')}</span>
                  <input className={styles.input} value={form.url} onChange={(event) => updateForm('url', event.target.value)} />
                </label>
              )}

              {form.protocol === 'wifi' && (
                <>
                  <label className={styles.row}>
                    <span className={styles.label}>{t('qrcode.fields.ssid')}</span>
                    <input className={styles.input} value={form.ssid} onChange={(event) => updateForm('ssid', event.target.value)} />
                  </label>
                  <div className={styles.inlineRow}>
                    <label className={styles.row}>
                      <span className={styles.label}>{t('qrcode.fields.encryption')}</span>
                      <select className={styles.select} value={form.encryption} onChange={(event) => updateForm('encryption', event.target.value as YourToolApp.WifiEncryption)}>
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">{t('qrcode.fields.none')}</option>
                      </select>
                    </label>
                    <label className={styles.row}>
                      <span className={styles.label}>{t('qrcode.fields.hidden')}</span>
                      <select className={styles.select} value={String(form.hidden)} onChange={(event) => updateForm('hidden', event.target.value === 'true')}>
                        <option value="false">{t('qrcode.fields.no')}</option>
                        <option value="true">{t('qrcode.fields.yes')}</option>
                      </select>
                    </label>
                  </div>
                  <label className={styles.row}>
                    <span className={styles.label}>{t('qrcode.fields.password')}</span>
                    <input className={styles.input} type="password" autoComplete="new-password" value={form.password} onChange={(event) => updateForm('password', event.target.value)} />
                  </label>
                </>
              )}

              {(form.protocol === 'email' || form.protocol === 'vcard') && (
                <label className={styles.row}>
                  <span className={styles.label}>{t('qrcode.fields.email')}</span>
                  <input className={styles.input} value={form.email} onChange={(event) => updateForm('email', event.target.value)} />
                </label>
              )}

              {form.protocol === 'email' && (
                <>
                  <label className={styles.row}>
                    <span className={styles.label}>{t('qrcode.fields.subject')}</span>
                    <input className={styles.input} value={form.subject} onChange={(event) => updateForm('subject', event.target.value)} />
                  </label>
                  <label className={styles.row}>
                    <span className={styles.label}>{t('qrcode.fields.body')}</span>
                    <textarea className={styles.textarea} value={form.body} onChange={(event) => updateForm('body', event.target.value)} />
                  </label>
                </>
              )}

              {(form.protocol === 'phone' || form.protocol === 'sms' || form.protocol === 'vcard') && (
                <label className={styles.row}>
                  <span className={styles.label}>{t('qrcode.fields.phone')}</span>
                  <input className={styles.input} value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} />
                </label>
              )}

              {form.protocol === 'sms' && (
                <label className={styles.row}>
                  <span className={styles.label}>{t('qrcode.fields.message')}</span>
                  <textarea className={styles.textarea} value={form.smsMessage} onChange={(event) => updateForm('smsMessage', event.target.value)} />
                </label>
              )}

              {form.protocol === 'vcard' && (
                <label className={styles.row}>
                  <span className={styles.label}>{t('qrcode.fields.name')}</span>
                  <input className={styles.input} value={form.name} onChange={(event) => updateForm('name', event.target.value)} />
                </label>
              )}

              {form.protocol === 'geo' && (
                <div className={styles.inlineRow}>
                  <label className={styles.row}>
                    <span className={styles.label}>{t('qrcode.fields.latitude')}</span>
                    <input className={styles.input} value={form.latitude} onChange={(event) => updateForm('latitude', event.target.value)} />
                  </label>
                  <label className={styles.row}>
                    <span className={styles.label}>{t('qrcode.fields.longitude')}</span>
                    <input className={styles.input} value={form.longitude} onChange={(event) => updateForm('longitude', event.target.value)} />
                  </label>
                </div>
              )}

              {form.protocol === 'event' && (
                <>
                  <label className={styles.row}>
                    <span className={styles.label}>{t('qrcode.fields.eventTitle')}</span>
                    <input className={styles.input} value={form.eventTitle} onChange={(event) => updateForm('eventTitle', event.target.value)} />
                  </label>
                  <label className={styles.row}>
                    <span className={styles.label}>{t('qrcode.fields.location')}</span>
                    <input className={styles.input} value={form.eventLocation} onChange={(event) => updateForm('eventLocation', event.target.value)} />
                  </label>
                  <div className={styles.inlineRow}>
                    <label className={styles.row}>
                      <span className={styles.label}>{t('qrcode.fields.startTime')}</span>
                      <input className={styles.input} type="datetime-local" value={form.eventStart} onChange={(event) => updateForm('eventStart', event.target.value)} />
                    </label>
                    <label className={styles.row}>
                      <span className={styles.label}>{t('qrcode.fields.endTime')}</span>
                      <input className={styles.input} type="datetime-local" value={form.eventEnd} onChange={(event) => updateForm('eventEnd', event.target.value)} />
                    </label>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </ToolModal>
    </>
  );
}
