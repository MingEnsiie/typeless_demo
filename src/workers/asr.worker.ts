self.onmessage = (event: MessageEvent<{ type: string }>) => {
  if (event.data.type === 'transcribe') {
    self.postMessage({ type: 'done', text: 'local transcription placeholder' });
  }
};
