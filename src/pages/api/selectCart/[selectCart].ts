import { NextApiRequest, NextApiResponse } from 'next';
import { Item } from 'types/item';
import { UserCart } from 'types/user';
import prisma from '../../../../lib/prisma';

export const SelectCart = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let userId;
  const { selectCart } = req.query;
  userId = Number(selectCart);

  const data = await prisma.user.findUnique({
    where: {
      userId: userId,
    },
    select: {
      carts: {
        include: {
          items: true,
        },
      },
    },
  });

  let errorFlg = false;
  if (!data) {
    errorFlg = true;
    return {
      errorFlg: errorFlg,
    };
  }

  let carts: UserCart[] = data.carts;
  carts.map((item) => {
    //　itemの型指定
    const tmpItem: Item = item.items;

    tmpItem.releaseDate = item.items.releaseDate.toString();
  });
  res.json({ cart: carts, errorFlg: errorFlg });
};

export default SelectCart;
