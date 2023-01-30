import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserCart, RentalHistory } from '../../types/user';
import prisma from '../../../lib/prisma';
import axios from 'axios';

export default withIronSessionApiRoute(getUserRoute, ironOptions);

export type SessionUser = {
  userId?: number;
  userName?: string;
  userCarts?: UserCart[];
  userRentalHistories?: RentalHistory[];
  favoriteGenre?: number;
  isLoggedIn: boolean;
};

async function getUserRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.session.user) {
    const userId = req.session.user.userId;

    const cartResult = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/getCartItem/${userId}`
    );
    const rentalResult = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/rental/${userId}`
    );
    const cart = cartResult.data.carts;
    const rental = rentalResult.data;
    res.json({
      userId: userId,
      isLoggedIn: true,
      userCarts: cart,
      userRentalHistories: rental,
    });
  } else {
    const sessionCart = req.session.cart;
    if (!sessionCart) {
      res.json({
        isLoggedIn: false,
      });
    } else {
      res.json({
        userCarts: sessionCart,
        isLoggedIn: false,
      });
    }
  }
}
