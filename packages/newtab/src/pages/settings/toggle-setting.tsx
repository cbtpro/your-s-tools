interface Props {
  value: boolean;
  onChange: (newValue: boolean) => void;
  label: string;
  styles: Record<string, React.CSSProperties>;
}

export default function ToggleSetting({ value, onChange, label, styles }: Props) {
  return (
    <div style={styles.settingItem}>
      <label style={styles.label}>{label}</label>
      <input
        type="checkbox"
        title={label}
        placeholder=""
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        style={styles.toggle}
      />
    </div>
  );
}
