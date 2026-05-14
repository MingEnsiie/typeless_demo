import localforage from 'localforage';
import type { HistoryItem } from '@/types';

const key = 'typeless-history-v1';
const limit = 200;

export async function loadHistory(): Promise<HistoryItem[]> {
  return (await localforage.getItem<HistoryItem[]>(key)) ?? [];
}

export async function saveHistory(item: HistoryItem): Promise<HistoryItem[]> {
  const current = await loadHistory();
  const next = [item, ...current].slice(0, limit);
  await localforage.setItem(key, next);
  return next;
}

export async function clearHistory(): Promise<void> {
  await localforage.removeItem(key);
}
