import { useCallback, useState } from 'react';
import { Button, Input } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import { useTranslation } from '@your-s-tools/i18n';
import { initialSettings, useStorageState } from '@your-s-tools/shared';
import type { YourToolApp } from '@your-s-tools/types';
import { openSearch, searchEngines } from '@/features/command-palette/search-engines';
import { useCompositionGuard } from '@/hooks/use-composition-guard';
import styles from './style.module.scss';

const { Group: InputGroup } = Input;

export const BaseSearchBar = () => {
  const { t } = useTranslation();
  const [commandPaletteSettings] = useStorageState<YourToolApp.Settings, 'commandPalette'>(
    'commandPalette',
    initialSettings.commandPalette,
  );
  const [value, setValue] = useState('');
  const compositionGuard = useCompositionGuard<HTMLInputElement>();

  const submitSearch = useCallback(() => {
    openSearch(value.trim(), commandPaletteSettings.searchOpenTarget);
  }, [commandPaletteSettings.searchOpenTarget, value]);

  return (
    <div className={styles.searchBar}>
      分手的方式大方的身份的所发生的
      <InputGroup compact className={styles.searchBox}>
        <Input
          value={value}
          className={styles.input}
          size="large"
          allowClear
          prefix={<IconSearch />}
          placeholder={t('search.placeholder')}
          aria-label={t('search.placeholder')}
          onChange={setValue}
          {...compositionGuard.compositionProps}
          onKeyDown={(event) => {
            if (compositionGuard.isEnterDuringComposition(event)) return;

            if (event.key === 'Enter') {
              event.preventDefault();
              submitSearch();
            }
          }}
        />
        {/* <Button
          className={styles.submitButton}
          type="primary"
          size="large"
          icon={<IconSearch />}
          onClick={submitSearch}
        >
          {t('search.submit')}
        </Button> */}
      </InputGroup>

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
