import { NextApiRequest, NextApiResponse } from 'next';
import { UserCart } from 'types/user';
import prisma from '../../../../lib/prisma';

export const addCart = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let userId;
  let itemId;
  let period;

  const { addCart } = req.query;
  if (Array.isArray(addCart)) {
    userId = Number(addCart[0]);
    itemId = Number(addCart[1]);
    period = Number(addCart[2]);
  } else {
    return res.redirect('/error');
  }
  await prisma.cart.create({
    data: {
      userId: userId,
      itemId: itemId,
      rentalPeriod: period,
    },
  });

  res.json({
    isAdd: true,
  });
};

export default addCart;
