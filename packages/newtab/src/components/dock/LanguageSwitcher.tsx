import { Select } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const Option = Select.Option;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        style={{ width: 140 }}
        prefix={<Globe size={16} />}
        triggerProps={{
          autoAlignPopupWidth: false,
          autoAlignPopupMinWidth: true,
          position: 'bottom',
        }}
      >
        <Option value="zh-CN">中文</Option>
        <Option value="en-US">English</Option>
      </Select>
    </div>
  );
}
