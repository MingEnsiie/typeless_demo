import type { AppRule } from '@/types';

export const APP_RULES: AppRule[] = [
  {
    id: 'email',
    label: 'Email',
    tone: 'professional email',
    formality: 'formal',
    markdown: false,
    placeholder: 'Hi team,\n\nSelect text here, rewrite it, or hold Space to dictate...',
  },
  {
    id: 'slack',
    label: 'Slack',
    tone: 'concise team chat',
    formality: 'casual',
    markdown: false,
    placeholder: 'Quick update for the channel...',
  },
  {
    id: 'wechat',
    label: 'WeChat',
    tone: 'natural Chinese message',
    formality: 'casual',
    markdown: false,
    placeholder: '这里可以模拟微信输入...',
  },
  {
    id: 'code',
    label: 'Code',
    tone: 'developer note with exact symbols preserved',
    formality: 'neutral',
    markdown: true,
    placeholder: 'Draft a commit message, PR summary, or code note...',
  },
  {
    id: 'notes',
    label: 'Notes',
    tone: 'structured personal notes',
    formality: 'neutral',
    markdown: true,
    placeholder: '- Meeting notes\n- Decisions\n- Follow-ups',
  },
  {
    id: 'casual',
    label: 'Casual',
    tone: 'friendly conversational writing',
    formality: 'casual',
    markdown: false,
    placeholder: 'Say something naturally...',
  },
];

export function getAppRule(id: string): AppRule {
  return APP_RULES.find((rule) => rule.id === id) ?? APP_RULES[0];
}
