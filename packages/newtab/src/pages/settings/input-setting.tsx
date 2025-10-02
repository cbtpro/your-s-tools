interface Props {
  value: string;
  onChange: (newValue: string) => void;
  label: string;
  styles: Record<string, React.CSSProperties>;
}

export default function InputSetting({ value, onChange, label, styles }: Props) {
  return (
    <div style={styles.settingItem}>
      <label style={styles.label}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}
