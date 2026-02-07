export const settingsStyles: Record<string, React.CSSProperties> = {
  container: {
    padding: '24px',
    maxWidth: '600px',
    margin: '40px auto',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    borderBottom: '1px solid #eee',
    marginBottom: '16px',
    paddingBottom: '8px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    color: '#333',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  settingItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 500,
    marginBottom: '4px',
  },
  toggle: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  select: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  input: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  footer: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  saveButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    background: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '8px 16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    background: '#fff',
    color: '#333',
    cursor: 'pointer',
  },
};
