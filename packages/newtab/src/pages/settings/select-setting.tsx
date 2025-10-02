interface Props {
  value: string;
  options: string[];
  onChange: (newValue: string) => void;
  label: string;
  styles: Record<string, React.CSSProperties>;
}

export default function SelectSetting({ value, options, onChange, label, styles }: Props) {
  return (
    <div style={styles.settingItem}>
      <label style={styles.label}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
