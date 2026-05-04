import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { IconCommand, IconCompass, IconSearch } from '@arco-design/web-react/icon';
import { useTranslation } from '@your-s-tools/i18n';
import { initialSettings, useStorageState } from '@your-s-tools/shared';
import type { YourToolApp } from '@your-s-tools/types';
import { useCompositionGuard } from '@/hooks/use-composition-guard';
import { createCommands, type CommandAction } from './commands';
import styles from './style.module.scss';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

function getCommandTitle(command: CommandAction, t: (key: string, options?: Record<string, string>) => string) {
  if (command.title) return command.title;
  if (command.titleKey) return t(command.titleKey);
  return '';
}

function getCommandDescription(command: CommandAction, t: (key: string, options?: Record<string, string>) => string) {
  return t(command.descriptionKey, {
    engine: command.engine ? t(command.engine.labelKey) : '',
    prefix: command.shortcut || '',
  });
}

function CommandIcon({ kind }: { kind: CommandAction['kind'] }) {
  if (kind === 'navigation') return <IconCompass />;
  return <IconSearch />;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [commandPaletteSettings] = useStorageState<YourToolApp.Settings, 'commandPalette'>(
    'commandPalette',
    initialSettings.commandPalette,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const compositionGuard = useCompositionGuard<HTMLInputElement>({
    onCompositionEnd: (event) => {
      setInput(event.currentTarget.value);
      setActiveIndex(0);
    },
  });

  const commands = useMemo(
    () => createCommands({
      input,
      navigate,
      searchOpenTarget: commandPaletteSettings.searchOpenTarget,
    }),
    [commandPaletteSettings.searchOpenTarget, input, navigate],
  );

  useEffect(() => {
    if (!open) return;

    setInput('');
    setActiveIndex(0);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    if (activeIndex >= commands.length) {
      setActiveIndex(Math.max(commands.length - 1, 0));
    }
  }, [activeIndex, commands.length]);

  if (!open) return null;

  const runCommand = (command: CommandAction | undefined) => {
    if (!command) return;

    command.run();
    onClose();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
    setActiveIndex(0);
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        className={styles.panel}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('commandPalette.title')}
      >
        <div className={styles.searchBox}>
          <IconCommand className={styles.searchIcon} />
          <input
            ref={inputRef}
            value={input}
            className={styles.input}
            placeholder={t('commandPalette.placeholder')}
            aria-label={t('commandPalette.placeholder')}
            onChange={handleChange}
            {...compositionGuard.compositionProps}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
                return;
              }

              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setActiveIndex((prev) => Math.min(prev + 1, commands.length - 1));
                return;
              }

              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setActiveIndex((prev) => Math.max(prev - 1, 0));
                return;
              }

              if (compositionGuard.isEnterDuringComposition(event)) return;

              if (event.key === 'Enter') {
                event.preventDefault();
                runCommand(commands[activeIndex]);
              }
            }}
          />
          <span className={styles.hint}>Esc</span>
        </div>

        <div className={styles.list}>
          {commands.length === 0 ? (
            <div className={styles.empty}>{t('commandPalette.empty')}</div>
          ) : commands.map((command, index) => (
            <button
              key={command.id}
              type="button"
              className={[
                styles.item,
                index === activeIndex ? styles.itemActive : '',
              ].filter(Boolean).join(' ')}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => runCommand(command)}
            >
              <span className={styles.itemIcon}>
                <CommandIcon kind={command.kind} />
              </span>
              <span className={styles.itemBody}>
                <span className={styles.itemTitle}>{getCommandTitle(command, t)}</span>
                <span className={styles.itemDescription}>{getCommandDescription(command, t)}</span>
              </span>
              {command.shortcut && <span className={styles.shortcut}>{command.shortcut}</span>}
            </button>
          ))}
        </div>

        <div className={styles.footer}>
          <span>{t('commandPalette.footer.navigate')}</span>
          <span>{t('commandPalette.footer.confirm')}</span>
        </div>
      </div>
    </div>
  );
}

export function useCommandPaletteShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCommandKey = event.metaKey || event.ctrlKey;
      if (!isCommandKey || event.key.toLowerCase() !== 'k') return;

      event.preventDefault();
      onOpen();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
}
