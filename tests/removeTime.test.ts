import { removeTime } from '../src/lib/removeTime';

describe('removeTimeアラート機能', () => {
  it('removeTimeと現在時刻が一致したらtrueを返す', () => {
    const lensInfo = {
      title: 'test',
      date: '2025-09-02',
      type: '1day',
      exchangeDate: '2025-09-03',
      stock: 1,
      removeTime: '12:30'
    };
    const now = new Date('2025-09-02T12:30:00');
    const result = removeTime(lensInfo, now);
    expect(result).toBe(true);
  });

  it('removeTimeと現在時刻が一致しなければfalseを返す', () => {
    const lensInfo = {
      title: 'test',
      date: '2025-09-02',
      type: '1day',
      exchangeDate: '2025-09-03',
      stock: 1,
      removeTime: '12:30'
    };
    const now = new Date('2025-09-02T08:00:00');
    const result = removeTime(lensInfo, now);
    expect(result).toBe(false);
  });
});