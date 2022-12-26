import { NextApiRequest, NextApiResponse } from 'next';

export const addCart = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let userId;
  let itemId;
  let period;
  
  const { addCart } = req.query;
  console.log(addCart);
  if (Array.isArray(addCart)) {
    userId = Number(addCart[0]);
    itemId = Number(addCart[1]);
    period = Number(addCart[2]);
  }

  // if(period){}
  const addCartItem = await prisma.cart.create({
    data: {
      userId: userId,
      itemId: itemId,
      rentalPeriod: period,
    },
  });

  let isAdd= true;
  res.json({
    isAdd: isAdd,
  });
};

export default addCart;
