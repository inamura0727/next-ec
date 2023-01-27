import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { User, UserCart, RentalHistory } from '../../types/user';
import prisma from '../../../lib/prisma';
import axios from 'axios';

export default withIronSessionApiRoute(getUserRoute, ironOptions);

async function getUserRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.session.user) {
    //   // セッションからユーザIDの取得
    const userId = req.session.user.userId;

    await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/${userId}`
    );

    //   // ユーザ情報に紐づくカートの取得
    //   const result = await prisma.user.findUnique({
    //     where:{
    //       userId:userId
    //     },
    //     select: {
    //       carts: {
    //         include: {
    //           items: true,
    //         },
    //       },
    //     },
    //   })
    //   if (!result) {
    //     return res.redirect('/error');
    //   }

    //   // レンタル履歴追加用のデータを作成
    //   const carts:UserCart[] = result.carts;
    //   const time = new Date();
    //   const addItem = carts.map((item) => {
    //     const tempItem = {
    //       userId: userId,
    //       itemId: item.itemId,
    //       itemName: `${item.items.artist} ${item.items.fesName}`,
    //       itemImage: item.items.itemImage,
    //       price: 0,
    //       rentalPeriod: item.rentalPeriod,
    //       payDate: time,
    //     };
    //     if(item.rentalPeriod === 2 ){
    //       tempItem.price = item.items.twoDaysPrice;
    //     }else{
    //       tempItem.price = item.items.sevenDaysPrice;
    //     }
    //     return tempItem;
    //   })

    //   // レンタル履歴テーブルとカートテーブルを同時更新
    //   const tran = await prisma.$transaction([
    //     // レンタル履歴に追加
    //     prisma.rentalHistory.createMany({
    //       data: addItem
    //     }),
    //     // カート情報を削除
    //     prisma.cart.deleteMany({
    //       where: {
    //         userId: userId
    //       }
    //     })
    //     // 失敗したらエラー画面へ
    //   ]).catch(() => res.redirect('/error'));
      res.redirect('/paymentComp');
  }
}
