import { Moon, Settings, Sun, WifiOff } from 'lucide-react';

export function Toolbar({
  darkMode,
  offlineMode,
  onDark,
  onOffline,
  onSettings,
}: {
  darkMode: boolean;
  offlineMode: boolean;
  onDark: (value: boolean) => void;
  onOffline: (value: boolean) => void;
  onSettings: () => void;
}) {
  return (
    <div className="toolbar">
      <button className={offlineMode ? 'active' : ''} onClick={() => onOffline(!offlineMode)}>
        <WifiOff size={16} /> 离线
      </button>
      <button onClick={() => onDark(!darkMode)}>{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
      <button onClick={onSettings}>
        <Settings size={16} /> 设置
      </button>
    </div>
  );
}
