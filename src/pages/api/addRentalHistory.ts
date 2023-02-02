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

    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/${userId}`
      );
    } catch (error) {
      // 失敗したらエラー画面へ
      res.redirect('/error');
    }
    res.redirect('/paymentComp');
  }
}
