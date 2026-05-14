export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  baseUrl: string;
  model: string;
  apiKey?: string;
  signal?: AbortSignal;
  onToken?: (token: string) => void;
}

export async function chatComplete(messages: ChatMessage[], opts: ChatOptions): Promise<string> {
  if (!opts.apiKey && !opts.baseUrl.includes('ollama')) {
    return demoCompletion(messages, opts.onToken);
  }

  const response = await fetch(`${opts.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.apiKey ? { Authorization: `Bearer ${opts.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: opts.model,
      messages,
      stream: false,
      temperature: 0.2,
    }),
    signal: opts.signal,
  });

  if (!response.ok) {
    throw new Error(`LLM ${response.status}: ${await response.text()}`);
  }
  const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = json.choices?.[0]?.message?.content ?? '';
  opts.onToken?.(content);
  return content;
}

async function demoCompletion(messages: ChatMessage[], onToken?: (token: string) => void): Promise<string> {
  const system = messages[0]?.content ?? '';
  const user = messages[messages.length - 1]?.content ?? '';
  let result = user;
  if (system.includes('translator')) {
    result = /[\u4e00-\u9fff]/.test(user)
      ? 'Hello, could you please organize this message and make it natural?'
      : '你好，可以帮我把这段内容整理得自然一点吗？';
  } else if (system.includes('text editor')) {
    result = user
      .replace(/^SELECTION:\s*/i, '')
      .replace(/\n\nINSTRUCTION:[\s\S]*$/i, '')
      .trim();
    result = result.length > 0 ? `${result}（已按指令优化）` : '已按指令优化的文本';
  } else {
    result = user
      .replace(/[嗯啊呃]|那个|就是|然后/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    result = result || '请帮我把这段口语整理成可以直接发送的文字，语气自然一点。';
    result = `${result.replace(/^[,，。 ]+/, '')}。`;
  }

  let streamed = '';
  for (const char of result) {
    streamed += char;
    onToken?.(streamed);
    await new Promise((resolve) => window.setTimeout(resolve, 8));
  }
  return result;
}
