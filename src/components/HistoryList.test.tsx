import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HistoryList } from './HistoryList';

describe('HistoryList', () => {
  it('supports deleting a history item without replaying it', () => {
    const onUse = vi.fn();
    const onDelete = vi.fn();

    render(
      <HistoryList
        items={[
          {
            id: 'h1',
            mode: 'dictate',
            raw: 'raw',
            finalText: 'final',
            appContext: 'email',
            createdAt: new Date('2026-05-14T00:00:00Z').toISOString(),
          },
        ]}
        onUse={onUse}
        onDelete={onDelete}
      />,
    );

    fireEvent.click(screen.getByLabelText('删除历史会话'));

    expect(onDelete).toHaveBeenCalledWith('h1');
    expect(onUse).not.toHaveBeenCalled();
  });
});
