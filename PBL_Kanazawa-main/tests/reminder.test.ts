// リマインダー機能のテスト
// このテストは、リマインダー登録・交換日計算・アラート判定の仕様を明確にします。
import { createLensInfo, getLensInfos, getExchangeDate } from '../src/lib/lensInfo';


describe('レンズ情報登録する', () => {
  beforeEach(async () => {
    // テスト前にレンズ情報を初期化
    const lensInfos = await getLensInfos();
    lensInfos.length = 0;
  });

  it('レンズ情報を登録できる', async () => {
    await createLensInfo({ title: '1dayレンズ', date: '2025-08-01', type: '1day', exchangeDate: '2025-08-02', stock: 30 ,removeTime: '21:00'});
    const lensInfos = await getLensInfos();
    expect(lensInfos.length).toBe(1);
    expect(lensInfos[0].title).toBe('1dayレンズ');
    expect(lensInfos[0].exchangeDate).toBe('2025-08-02');
    expect(lensInfos[0].stock).toBe(30);
    expect(lensInfos[0].removeTime).toBe('21:00');
  });
});

describe('交換日計算', () => {
  it('1dayタイプは翌日が交換日', () => {
    const date = getExchangeDate({ title: '', date: '2025-08-01', type: '1day', exchangeDate: '', stock: 1 });
    expect(date).toBe('2025-08-02');
  });
  it('2weekタイプは14日後が交換日', () => {
    const date = getExchangeDate({ title: '', date: '2025-08-01', type: '2week', exchangeDate: '', stock: 1 });
    expect(date).toBe('2025-08-15');
  });
  it('1monthタイプは30日後が交換日', () => {
    const date = getExchangeDate({ title: '', date: '2025-08-01', type: '1month', exchangeDate: '', stock: 1 });
    expect(date).toBe('2025-08-31');
  });
});
