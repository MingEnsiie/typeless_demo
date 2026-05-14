import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HotkeyHint } from './HotkeyHint';

describe('HotkeyHint', () => {
  it('shows input state only while the key is held', () => {
    const { rerender } = render(<HotkeyHint mode="dictate" recording />);

    expect(screen.getByText('正在输入')).toBeInTheDocument();

    rerender(<HotkeyHint mode="dictate" recording={false} />);

    expect(screen.queryByText('正在输入')).not.toBeInTheDocument();
    expect(screen.queryByText('正在录音')).not.toBeInTheDocument();
    expect(screen.getByText('听写模式')).toBeInTheDocument();
  });
});
