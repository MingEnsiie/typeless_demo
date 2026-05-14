import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useHotkey } from './useHotkey';

describe('useHotkey', () => {
  it('uses left Alt as the push-to-talk key instead of Space', () => {
    const onDown = vi.fn();
    const onUp = vi.fn();
    const onTranslate = vi.fn();
    renderHook(() => useHotkey({ mode: 'dictate', onDown, onUp, onTranslate }));

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));
    expect(onDown).not.toHaveBeenCalled();
    expect(onUp).not.toHaveBeenCalled();

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'AltLeft' }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'AltLeft' }));
    expect(onDown).toHaveBeenCalledWith('dictate');
    expect(onUp).toHaveBeenCalledTimes(1);
  });

  it('uses right Alt for selected-text voice instructions when enabled', () => {
    const onDown = vi.fn();
    const onUp = vi.fn();
    const onTranslate = vi.fn();
    const onRightAltDown = vi.fn();
    const onRightAltUp = vi.fn();
    renderHook(() => useHotkey({ mode: 'dictate', onDown, onUp, onTranslate, onRightAltDown, onRightAltUp }));

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'AltRight' }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'AltRight' }));

    expect(onRightAltDown).toHaveBeenCalledTimes(1);
    expect(onRightAltUp).toHaveBeenCalledTimes(1);
    expect(onDown).not.toHaveBeenCalled();
    expect(onUp).not.toHaveBeenCalled();
  });

  it('uses Ctrl plus left Alt as the push-to-translate key', () => {
    const onDown = vi.fn();
    const onUp = vi.fn();
    const onTranslate = vi.fn();
    renderHook(() => useHotkey({ mode: 'dictate', onDown, onUp, onTranslate }));

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'AltLeft', ctrlKey: true }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'AltLeft', ctrlKey: true }));

    expect(onTranslate).toHaveBeenCalledTimes(1);
    expect(onDown).not.toHaveBeenCalled();
    expect(onUp).toHaveBeenCalledTimes(1);
  });

  it('does not use Ctrl or Cmd plus Shift plus T for translation anymore', () => {
    const onDown = vi.fn();
    const onUp = vi.fn();
    const onTranslate = vi.fn();
    renderHook(() => useHotkey({ mode: 'dictate', onDown, onUp, onTranslate }));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 't', ctrlKey: true, shiftKey: true }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 't', metaKey: true, shiftKey: true }));

    expect(onTranslate).not.toHaveBeenCalled();
  });
});
