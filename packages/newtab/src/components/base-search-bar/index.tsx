import { useRef, useState, type ChangeEvent, type CompositionEvent } from 'react';
import { IconSearch } from '@arco-design/web-react/icon';
import { useTranslation } from '@your-s-tools/i18n';
import { initialSettings, useStorageState } from '@your-s-tools/shared';
import type { YourToolApp } from '@your-s-tools/types';
import { openSearch, searchEngines } from '@/features/command-palette/search-engines';
import styles from './style.module.scss';

export const BaseSearchBar = () => {
  const { t } = useTranslation();
  const [commandPaletteSettings] = useStorageState<YourToolApp.Settings, 'commandPalette'>(
    'commandPalette',
    initialSettings.commandPalette,
  );
  const [value, setValue] = useState('');
  const isComposingRef = useRef(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  const handleCompositionEnd = (event: CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    setValue(event.currentTarget.value);
  };

  const submitSearch = () => {
    openSearch(value, commandPaletteSettings.searchOpenTarget);
  };

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchBox}>
        <IconSearch className={styles.searchIcon} />
        <input
          value={value}
          className={styles.input}
          placeholder={t('search.placeholder')}
          aria-label={t('search.placeholder')}
          onChange={handleChange}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !isComposingRef.current) {
              submitSearch();
            }
          }}
        />
        <button type="button" className={styles.submitButton} onClick={submitSearch}>
          {t('search.submit')}
        </button>
      </div>

      <div className={styles.engineList}>
        {searchEngines.map((engine) => (
          <span key={engine.key} className={styles.engineChip}>
            <span className={styles.enginePrefix}>{engine.prefix}</span>
            <span>{t(engine.labelKey)}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default BaseSearchBar;
