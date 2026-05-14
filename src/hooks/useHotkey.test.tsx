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
});
