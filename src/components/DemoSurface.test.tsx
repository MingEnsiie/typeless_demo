import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DemoSurface } from './DemoSurface';
import { getAppRule } from '@/lib/llm/prompts/app-rules';

describe('DemoSurface', () => {
  it('shows a stable selected-text edit entry when text is selected', () => {
    render(
      <DemoSurface
        ref={createRef<HTMLTextAreaElement>()}
        value="selected text"
        rule={getAppRule('notes')}
        streamingSelection={false}
        selection={{
          start: 0,
          end: 8,
          text: 'selected',
          rect: new DOMRect(10, 10, 1, 20),
        }}
        onChange={vi.fn()}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText('已选中 8 字')).toBeInTheDocument();
    expect(screen.getByText('AI 改写选区')).toBeInTheDocument();
  });
});
