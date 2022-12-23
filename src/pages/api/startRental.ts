import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { User, RentalHistory } from '../../types/user';

export default withIronSessionApiRoute(startRentalRoute, ironOptions);

// 起動側からレンタル履歴IDをもらう
async function startRentalRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.session.user) {
    const url = `http://localhost:8000/users/${req.session.user.userId}`;

    // レンタル履歴IDの取得
    const id = Number(req.body.id);

    // ログインユーザの情報を取得
    const result = await fetch(url);
    const userData: User = await result.json();
    let rentalHistory: RentalHistory[] = userData.rentalHistories;

    // 対象作品の取得
    const rantalItem = rentalHistory.find(
      (item: RentalHistory) => item.id === id
    );

    // 対象作品が見つからない場合はエラーを返却
    if (!rantalItem) {
      res.json({ result: false });
      return false;
    }

    // すでに再生済の場合は処理を行わない
    if (rantalItem.rentalStart) {
      res.json({ result: true });
      return true;
    }

    // レンタル期間を取得し、レンタル開始日とレンタル終了日を設定する
    const rentalPeriod = rantalItem.rentalPeriod;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + rentalPeriod);
    rantalItem.rentalStart = new Date();
    rantalItem.rentalEnd = endDate;

    // 対象作品を更新
    const index = rentalHistory.findIndex((item) => item.id === id);
    rentalHistory[index] = rantalItem;

    // データベースを更新する
    const data = { rentalHistories: rentalHistory };
    await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(() => res.json({ result: true }));
  } else {
    res.json({ result: false });
  }
}
