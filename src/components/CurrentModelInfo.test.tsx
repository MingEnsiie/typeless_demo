import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurrentModelInfo } from './CurrentModelInfo';
import type { EndpointConfig } from '@/types';

const qwenAsr: EndpointConfig = {
  id: 'qwen3-asr-local',
  label: 'Qwen3-ASR-1.7B Local',
  kind: 'asr',
  baseUrl: 'local://qwen3-asr',
  model: 'Qwen3-ASR-1.7B',
  localPath: '/home/mingzh/Documents/Workplace/QwenAsset/model/Qwen3-ASR-1.7B',
  apiKey: '',
  enabled: true,
};

const deepseek: EndpointConfig = {
  id: 'deepseek',
  label: 'DeepSeek V4 Flash',
  kind: 'llm',
  baseUrl: '/api/llm/deepseek/v1',
  model: 'deepseek-v4-flash',
  apiKey: '',
  enabled: true,
};

describe('CurrentModelInfo', () => {
  it('shows selected ASR and LLM model details', () => {
    render(<CurrentModelInfo asrEndpoint={qwenAsr} llmEndpoint={deepseek} offlineMode={false} />);

    expect(screen.getByLabelText('当前调用模型信息')).toBeInTheDocument();
    expect(screen.getByText('Qwen3-ASR-1.7B Local')).toBeInTheDocument();
    expect(screen.getByText('/home/mingzh/Documents/Workplace/QwenAsset/model/Qwen3-ASR-1.7B')).toBeInTheDocument();
    expect(screen.getByText('DeepSeek V4 Flash')).toBeInTheDocument();
    expect(screen.getByText('deepseek-v4-flash')).toBeInTheDocument();
  });
});
