import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default withIronSessionApiRoute(startRentalRoute, ironOptions);

// 起動側からレンタル履歴IDをもらう
async function startRentalRoute(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.session.user) {

		// レンタル履歴IDの取得
		const { rentalHistoryId } = req.query;
		console.log(rentalHistoryId)
		if(!rentalHistoryId){
			return res.json({ result: false });
		}
		const id = Number(rentalHistoryId);
		console.log(id)

		// ログインユーザのレンタル履歴情報を取得
		const rentalHistory = await prisma.rentalHistory.findMany({
			where: {
				userId: req.session.user.userId
			}
		})

		// 対象作品の取得
		const rantalItem = rentalHistory.find(
			(item) => item.rentalHistoryId === id
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
		endDate.setDate(startDate.getDate() + rentalPeriod)

		// 対象作品を更新データ作成
		const updateItem = {
			rentalStart: startDate,
			rentalEnd: endDate
		}

		// データベースを更新する
		await prisma.rentalHistory.update({
			where: {
				rentalHistoryId: rantalItem.rentalHistoryId
			},
			data: updateItem
		})

		res.json({ result: true })
	}
}
