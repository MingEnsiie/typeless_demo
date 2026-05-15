import type { AppRule } from '@/types';

export const APP_RULES: AppRule[] = [
  {
    id: 'email',
    label: 'Email',
    tone: 'professional email',
    formality: 'formal',
    markdown: false,
    outputGuidance:
      'Format as a professional email: clear greeting when useful, short paragraphs, explicit ask or next step, and a polite closing if the message is more than one sentence.',
    placeholder: 'Hi team,\n\nSelect text here, rewrite it, or hold left Alt to dictate...',
  },
  {
    id: 'slack',
    label: 'Slack',
    tone: 'concise team chat',
    formality: 'casual',
    markdown: false,
    outputGuidance:
      'Format as a Slack message: direct, compact, no email greeting or sign-off, use one-line updates or short bullets, keep @mentions and channel-friendly wording.',
    placeholder: 'Quick update for the channel...',
  },
  {
    id: 'wechat',
    label: 'WeChat',
    tone: 'natural Chinese message',
    formality: 'casual',
    markdown: false,
    outputGuidance:
      'Format as a natural WeChat message in Chinese when the input is Chinese: warm, brief, conversational, no corporate email structure, avoid heavy punctuation.',
    placeholder: '这里可以模拟微信输入...',
  },
  {
    id: 'code',
    label: 'Code',
    tone: 'developer note with exact symbols preserved',
    formality: 'neutral',
    markdown: true,
    outputGuidance:
      'Format for developer workflows: preserve code symbols exactly, prefer Markdown, use commit/PR/code-review style, and separate context, change, and action when relevant.',
    placeholder: 'Draft a commit message, PR summary, or code note...',
  },
  {
    id: 'notes',
    label: 'Notes',
    tone: 'plain personal notes',
    formality: 'neutral',
    markdown: false,
    outputGuidance:
      'Format as normal plain-text notes: keep the wording clear and scan-friendly, preserve useful line breaks, capture decisions and follow-ups when present, but do not add Markdown headings, Markdown bullets, or code-style formatting unless the user explicitly dictated them.',
    placeholder: 'Meeting notes\nDecisions\nFollow-ups',
  },
  {
    id: 'casual',
    label: 'Casual',
    tone: 'friendly conversational writing',
    formality: 'casual',
    markdown: false,
    outputGuidance:
      'Format as casual writing: friendly, simple, natural, preserve personality, no formal sign-off, avoid over-structuring unless the user dictated a list.',
    placeholder: 'Say something naturally...',
  },
];

export function getAppRule(id: string): AppRule {
  return APP_RULES.find((rule) => rule.id === id) ?? APP_RULES[0];
}
