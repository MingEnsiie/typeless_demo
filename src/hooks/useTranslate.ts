import { useConfigStore } from '@/lib/storage/config';

export function useTranslate() {
  const targetLang = useConfigStore((state) => state.targetLang);
  const setMode = useConfigStore((state) => state.setMode);
  const setTargetLang = useConfigStore((state) => state.setTargetLang);
  return {
    targetLang,
    trigger: () => setMode('translate'),
    retranslate: setTargetLang,
  };
}
