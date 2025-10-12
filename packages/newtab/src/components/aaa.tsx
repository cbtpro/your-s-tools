import React, { useState, useRef } from 'react';

const MacSafeInput: React.FC = () => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposing = useRef(false);

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;
    setValue(e.currentTarget.value);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    // 不在组合中时更新
    if (!isComposing.current) {
      setValue(e.currentTarget.value);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h3>💡 macOS 拼音可输入 Demo（修正版）</h3>

      {/* 关键点：不要用 value，改用 defaultValue + ref 读取 */}
      <input
        ref={inputRef}
        defaultValue={value}
        onInput={handleInput}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder="请输入中文或英文"
        style={{
          width: 260,
          padding: '8px 10px',
          fontSize: 14,
          border: '1px solid #ccc',
          borderRadius: 4,
        }}
      />

      <button
        style={{ marginTop: 12 }}
        onClick={() => alert(`当前输入内容：${inputRef.current?.value}`)}
      >
        获取输入框内容
      </button>

      <p style={{ marginTop: 12 }}>
        当前值（state 同步）：<b>{value}</b>
      </p>
    </div>
  );
};

export default MacSafeInput;
