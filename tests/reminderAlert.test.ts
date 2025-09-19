import { getDaysUntilExchange, LensInfo } from '../src/lib/lensInfo';
// import { daysUntilExchange } from '../src/app';

describe('getDaysUntilExchange', () => {
  const baseLensInfo: LensInfo = {
    title: '',
    date: '',
    type: '',
    exchangeDate: '',
    stock: 0,
    removeTime: ''
  };

  it('交換日が今日なら0を返す', () => {
    const today = new Date().toISOString().slice(0, 10);
    const lensInfo: LensInfo = { ...baseLensInfo, exchangeDate: today };
    const result = getDaysUntilExchange(lensInfo);
    expect(result).toBe(0);
  });

  it('交換日が明日なら1を返す', () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const lensInfo: LensInfo = { ...baseLensInfo, exchangeDate: tomorrow };
    const result = getDaysUntilExchange(lensInfo);
    expect(result).toBe(1);
  });

  it('交換日が昨日なら-1を返す', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const lensInfo: LensInfo = { ...baseLensInfo, exchangeDate: yesterday };
    const result = getDaysUntilExchange(lensInfo);
    expect(result).toBe(-1);
  });

  it('不正な日付なら-100を返す', () => {
    const lensInfo: LensInfo = { ...baseLensInfo, exchangeDate: 'invalid-date' };
    const result = getDaysUntilExchange(lensInfo);
    expect(result).toBe(-100);
  });
});