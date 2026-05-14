export function Waveform({ levels, active }: { levels: number[]; active: boolean }) {
  return (
    <div className={active ? 'waveform active' : 'waveform'} aria-label="recording waveform">
      {levels.map((level, index) => (
        <span key={index} style={{ height: `${Math.max(10, level * 72)}px` }} />
      ))}
    </div>
  );
}
