// 戻ってくるデータは削除した後のカート情報
//ログイン状態のみ使用
import prisma from '../../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export const deleteCart = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let cartId;
  const { DeleteCart } = req.query;
  cartId = Number(DeleteCart);
  await prisma.cart.delete({
    where: {
      cartId: cartId,
    },
  });
  let success = true;
  res.json({ success: success });
};

export default deleteCart;
