import { useEffect } from 'react';
import type { TypelessMode } from '@/types';

interface HotkeyOptions {
  disabled?: boolean;
  mode: TypelessMode;
  onDown: (mode: TypelessMode) => void;
  onUp: () => void;
  onTranslate: () => void;
  onRightAltDown?: () => void;
  onRightAltUp?: () => void;
}

export function useHotkey({ disabled, mode, onDown, onUp, onTranslate, onRightAltDown, onRightAltUp }: HotkeyOptions) {
  useEffect(() => {
    if (disabled) return undefined;
    const down = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (event.code === 'AltRight' && !event.repeat && onRightAltDown) {
        event.preventDefault();
        onRightAltDown();
        return;
      }
      if (event.code === 'AltLeft' && event.ctrlKey && !event.repeat) {
        event.preventDefault();
        onTranslate();
        return;
      }
      if (event.code === 'AltLeft' && !event.repeat && !isTyping) {
        event.preventDefault();
        onDown(mode);
      }
    };
    const up = (event: KeyboardEvent) => {
      if (event.code === 'AltRight' && onRightAltUp) {
        event.preventDefault();
        onRightAltUp();
        return;
      }
      if (event.code === 'AltLeft') {
        event.preventDefault();
        onUp();
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [disabled, mode, onDown, onRightAltDown, onRightAltUp, onTranslate, onUp]);
}
