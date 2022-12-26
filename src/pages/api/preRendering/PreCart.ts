import { UserCart } from '../../../types/user';
import prisma from '../../../../lib/prisma';
import { Item } from 'types/item';

export const PreCart = async (
  req: number
): Promise<{ cart?: UserCart[]; errorFlg: boolean }> => {
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
