import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { User, UserCart, RentalHistory } from '../../types/user';
import {config} from '../../config/index'

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
  res: NextApiResponse<SessionUser>
) {
  if (req.session.user) {
    const result = await fetch(
      `http://localhost:8000/users/${req.session.user.id}`
    );
    const userData: User = await result.json();
    res.json({
      userId: userData.id,
      userName: userData.userName,
      userCarts: userData.userCarts,
      userRentalHistories: userData.rentalHistories,
      favoriteGenre: userData.favoriteGenre,
      isLoggedIn: true,
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
