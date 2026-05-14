import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ResultPanel } from './ResultPanel';

describe('ResultPanel', () => {
  it('shows the full visual flow from raw ASR through preview to final output', () => {
    render(
      <ResultPanel
        mode="dictate"
        raw="raw words"
        finalText="polished words"
        streaming=""
        onCopy={vi.fn()}
        onRetranslate={vi.fn()}
      />,
    );

    expect(screen.getByText('RAW ASR')).toBeInTheDocument();
    expect(screen.getByText('POLISH PREVIEW')).toBeInTheDocument();
    expect(screen.getByText('FINAL INPUT')).toBeInTheDocument();
    expect(screen.getAllByText('polished words')).toHaveLength(2);
  });
});
