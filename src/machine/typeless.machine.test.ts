import { describe, expect, it } from 'vitest';
import { createActor } from 'xstate';
import { typelessMachine } from './typeless.machine';

describe('typelessMachine', () => {
  it('tracks mode while recording and returns idle after injection', () => {
    const actor = createActor(typelessMachine);
    actor.start();

    actor.send({ type: 'HOTKEY_DOWN', mode: 'translate' });
    expect(actor.getSnapshot().matches('recording')).toBe(true);
    expect(actor.getSnapshot().context.mode).toBe('translate');

    actor.send({ type: 'HOTKEY_UP' });
    actor.send({ type: 'ASR_DONE', raw: '你好' });
    actor.send({ type: 'LLM_DONE', final: 'Hello' });
    actor.send({ type: 'INJECT_DONE' });

    expect(actor.getSnapshot().matches('idle')).toBe(true);
    expect(actor.getSnapshot().context.finalText).toBe('Hello');
  });
});
