import {
  useCallback,
  useRef,
  type CompositionEvent,
  type KeyboardEvent,
} from 'react';

type CompositionElement = HTMLInputElement | HTMLTextAreaElement;

interface UseCompositionGuardOptions<T extends CompositionElement> {
  onCompositionEnd?: (event: CompositionEvent<T>) => void;
}

export function useCompositionGuard<T extends CompositionElement = HTMLInputElement>({
  onCompositionEnd,
}: UseCompositionGuardOptions<T> = {}) {
  const isComposingRef = useRef(false);

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback((event: CompositionEvent<T>) => {
    isComposingRef.current = false;
    onCompositionEnd?.(event);
  }, [onCompositionEnd]);

  const isComposing = useCallback((event?: KeyboardEvent<T>) => (
    isComposingRef.current || Boolean(event?.nativeEvent.isComposing)
  ), []);

  const isEnterDuringComposition = useCallback((event: KeyboardEvent<T>) => (
    event.key === 'Enter' && isComposing(event)
  ), [isComposing]);

  return {
    isComposing,
    isEnterDuringComposition,
    compositionProps: {
      onCompositionStart: handleCompositionStart,
      onCompositionEnd: handleCompositionEnd,
    },
  };
}
