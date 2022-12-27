// 戻ってくるデータは削除した後のカート情報
//ログイン状態のみ使用
import prisma from '../../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export const deleteCart = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let userId;
  let cartId;
  const { DeleteCart } = req.query;
  if (Array.isArray(DeleteCart)) {
    userId = Number(DeleteCart[0]);
    cartId = Number(DeleteCart[1]);
  }
  await prisma.cart.delete({
    where: {
      cartId: cartId,
    },
  });
  let success = true;
  res.json({ success: success });
};

export default deleteCart;
