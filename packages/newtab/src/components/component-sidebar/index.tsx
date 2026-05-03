import { useEffect, useMemo, useRef, useState, type CompositionEvent, type FormEvent, type ReactNode } from 'react';
import { useDrag } from 'react-dnd';
import {
  IconApps,
  IconCommon,
  IconMinusCircle,
  IconPlusCircle,
  IconSearch,
} from '@arco-design/web-react/icon';
import { useTranslation } from '@your-s-tools/i18n';
import {
  componentGroupKeys,
  componentIconMap,
  componentList,
  type ComponentGroupKey,
  type ComponentItem,
} from '@/constants/components';
import styles from './style.module.scss';

interface ComponentSidebarProps {
  components?: ComponentItem[];
  showDisabled?: boolean;
}

interface LocalizedComponentItem extends ComponentItem {
  label: string;
  groupLabel: string;
}

interface DraggableComponentProps {
  type: string;
  label: string;
  icon: ReactNode;
}

interface ComponentSearchProps {
  value: string;
  suggestions: LocalizedComponentItem[];
  onChange: (value: string) => void;
}

function classNames(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(' ');
}

function DraggableComponent({ type, label, icon }: DraggableComponentProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [type]);

  useEffect(() => {
    if (itemRef.current) {
      drag(itemRef.current);
    }
  }, [drag]);

  return (
    <div
      ref={itemRef}
      className={classNames(styles.sidebarItem, isDragging && styles.isDragging)}
      role="button"
      tabIndex={0}
      aria-label={label}
    >
      <div className={styles.itemIcon}>{icon}</div>
      <span className={styles.itemLabel}>{label}</span>
    </div>
  );
}

function SidebarHeader() {
  const { t } = useTranslation();

  return (
    <div className={styles.sidebarHeader}>
      <IconApps />
      <span>{t('components.sidebar.title')}</span>
    </div>
  );
}

function GroupToggleIcon({ collapsed }: { collapsed: boolean }) {
  return collapsed ? <IconPlusCircle /> : <IconMinusCircle />;
}

function ComponentSearch({ value, suggestions, onChange }: ComponentSearchProps) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const isComposingRef = useRef(false);
  const showSuggestions = focused && value.trim() && suggestions.length > 0;

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    if (!isComposingRef.current) {
      onChange(event.currentTarget.value);
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (event: CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    onChange(event.currentTarget.value);
  };

  const selectSuggestion = (component: LocalizedComponentItem) => {
    onChange(component.label);
    setFocused(false);
  };

  return (
    <div className={styles.searchBox}>
      <IconSearch className={styles.searchIcon} />
      <input
        value={value}
        type="text"
        className={styles.searchInput}
        placeholder={t('components.sidebar.searchPlaceholder')}
        aria-label={t('components.sidebar.searchPlaceholder')}
        aria-autocomplete="list"
        aria-expanded={Boolean(showSuggestions)}
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />

      {showSuggestions && (
        <div className={styles.suggestionList} role="listbox">
          {suggestions.map((component) => (
            <button
              key={component.type}
              type="button"
              className={styles.suggestionItem}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectSuggestion(component)}
              role="option"
            >
              <span className={styles.suggestionLabel}>{component.label}</span>
              <span className={styles.suggestionMeta}>{component.groupLabel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ComponentGroup({
  groupKey,
  groupLabel,
  components,
  collapsed,
  onToggle,
}: {
  groupKey: ComponentGroupKey;
  groupLabel: string;
  components: LocalizedComponentItem[];
  collapsed: boolean;
  onToggle: (group: ComponentGroupKey) => void;
}) {
  return (
    <section className={styles.componentGroup}>
      <button
        type="button"
        className={styles.groupHeader}
        onClick={() => onToggle(groupKey)}
        aria-expanded={!collapsed}
      >
        <span>{groupLabel}</span>
        <GroupToggleIcon collapsed={collapsed} />
      </button>

      {!collapsed && (
        <div className={styles.componentGrid}>
          {components.map((component) => (
            <DraggableComponent
              key={component.type}
              type={component.type}
              label={component.label}
              icon={componentIconMap[component.icon] ?? <IconCommon />}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function ComponentSidebar({
  components = componentList,
  showDisabled = true,
}: ComponentSidebarProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<ComponentGroupKey, boolean>>({
    layout: false,
    container: false,
    feature: false,
  });

  const localizedComponents = useMemo<LocalizedComponentItem[]>(() => (
    components
      .filter((component) => showDisabled || component.enabled)
      .map((component) => ({
        ...component,
        label: t(component.labelKey),
        groupLabel: t(`components.groups.${component.groupKey}`),
      }))
  ), [components, showDisabled, t]);

  const filteredComponents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return localizedComponents;

    return localizedComponents.filter((component) => (
      component.label.toLowerCase().includes(keyword) ||
      component.groupLabel.toLowerCase().includes(keyword) ||
      component.type.toLowerCase().includes(keyword)
    ));
  }, [localizedComponents, search]);

  const suggestedComponents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return [];

    return localizedComponents
      .filter((component) => (
        component.label.toLowerCase().includes(keyword) ||
        component.type.toLowerCase().includes(keyword)
      ))
      .slice(0, 6);
  }, [localizedComponents, search]);

  const groupedComponents = useMemo(() => (
    componentGroupKeys
      .map((groupKey) => ({
        groupKey,
        groupLabel: t(`components.groups.${groupKey}`),
        components: filteredComponents.filter((component) => component.groupKey === groupKey),
      }))
      .filter((group) => group.components.length > 0)
  ), [filteredComponents, t]);

  const toggleGroup = (group: ComponentGroupKey) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <aside className={styles.componentSidebar}>
      <SidebarHeader />

      <ComponentSearch
        value={search}
        suggestions={suggestedComponents}
        onChange={setSearch}
      />

      <div className={styles.groupList}>
        {groupedComponents.map((group) => (
          <ComponentGroup
            key={group.groupKey}
            groupKey={group.groupKey}
            groupLabel={group.groupLabel}
            components={group.components}
            collapsed={collapsedGroups[group.groupKey]}
            onToggle={toggleGroup}
          />
        ))}
      </div>
    </aside>
  );
}
