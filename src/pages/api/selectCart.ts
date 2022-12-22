import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { User, UserCart, RentalHistory } from '../../types/user';
import prisma from '../../../lib/prisma';
import { Item } from 'types/item';

export const SelectCart = async (
  req: number
): Promise<{ cart?: UserCart[]; errorFlg: boolean }> => {
  console.log('selectCartきた');
  const data = await prisma.user.findUnique({
    where: {
      userId: req,
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
  return {
    cart: carts,
    errorFlg: errorFlg,
  };
};
