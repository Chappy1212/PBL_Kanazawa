export function removeTime(
  lensInfo: { removeTime?: string },
  now: Date
): boolean {
  if (!lensInfo.removeTime) return false;
  // 現在時刻を "HH:mm" 形式で取得
  const hhmm = now.toTimeString().slice(0, 5);
  return lensInfo.removeTime === hhmm;
}