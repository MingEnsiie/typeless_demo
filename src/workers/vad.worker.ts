self.onmessage = (event: MessageEvent<{ type: string }>) => {
  if (event.data.type === 'start') {
    self.postMessage({ type: 'ready' });
  }
};
