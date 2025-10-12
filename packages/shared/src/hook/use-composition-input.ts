import { useRef, useState, useCallback } from 'react';

/**
 * 通用中文输入安全 Hook
 * 支持拼音输入法，不会出现输入法闪退、丢字问题
 * 返回值：
 *   value：当前值
 *   bind：可直接展开到 <input {...bind} />
 *   setValue：手动修改输入值
 */
export default function useCompositionInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const isComposing = useRef(false);

  const handleCompositionStart = useCallback(() => {
    isComposing.current = true;
  }, []);

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLInputElement>) => {
      isComposing.current = false;
      setValue(e.currentTarget.value);
    },
    []
  );

  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    if (!isComposing.current) {
      setValue(e.currentTarget.value);
    }
  }, []);

  // ✅ 提供一组可以直接绑定的属性
  const bind = {
    defaultValue: value,
    onInput: handleInput,
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
  };

  return { value, setValue, bind };
}
