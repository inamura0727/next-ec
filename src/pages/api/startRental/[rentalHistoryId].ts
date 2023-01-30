import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import axios from 'axios';

export default withIronSessionApiRoute(startRentalRoute, ironOptions);

// 起動側からレンタル履歴IDをもらう
async function startRentalRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.session.user) {
    // レンタル履歴IDの取得
    const { rentalHistoryId } = req.query;
    if (!rentalHistoryId) {
      return res.json({ result: false });
    }
    const id = Number(rentalHistoryId);
    // ログインユーザのレンタル履歴情報を取得
    const userId = req.session.user.userId;
    const resutl = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/rental/${userId}`
    );
    const rentalHistory = resutl.data;

    // 対象作品の取得
    const rantalItem = rentalHistory.find(
      (item: { rentalHistoryId: number }) =>
        item.rentalHistoryId === id
    );

    // 対象作品が見つからない場合はエラーを返却
    if (!rantalItem) {
      return res.json({ result: false });
    }

    // すでに再生済の場合は処理を行わない
    if (rantalItem.rentalStart) {
      return res.json({ result: true });
    }

    // レンタル期間を取得し、レンタル開始日とレンタル終了日を設定する
    const rentalPeriod = rantalItem.rentalPeriod;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + rentalPeriod);

    // 対象作品を更新データ作成
    const updateItem = {
      rentalStart: startDate,
      rentalEnd: endDate,
    };

    // データベースを更新する
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/rental/update/${id}`,
      {
        rentalStart: startDate,
        rentalEnd: endDate,
      }
    );

    res.json({ result: true });
  }
}
