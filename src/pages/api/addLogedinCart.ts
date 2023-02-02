import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ironOptions } from '../../../lib/ironOprion';
import axios from 'axios';

export default withIronSessionApiRoute(addLogedinCart, ironOptions);

async function addLogedinCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //ユーザ情報がない場合はエラー画面へ
  if (!req.session.user) {
    return res.redirect('/error');
  }
  const userId = req.session.user.userId;
  if (req.session.cart && req.session.cart.length !== 0) {
    // sessionのカートからcartId以外を取得
    const sessionCart = req.session.cart.map((item) => {
      const data = {
        itemId: item.itemId,
        userId: userId,
        rentalPeriod: item.rentalPeriod,
      };
      return data;
    });
    // cartテーブルに追加
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/transmitCart`,
      sessionCart
    );
    // sessionのカートを空にする
    req.session.cart = [];
  }
  res.redirect('/');
}
