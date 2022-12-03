import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { User, UserCart, RentalHistory } from '../../types/user';

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
      `http://localhost:3000/api/users/${req.session.user.id}`
    );
    const userData: User = await result.json();
    const cart: UserCart[] = userData.userCarts;
    res.json({
      userId: userData.id,
      userName: userData.userName,
      userCarts: userData.userCarts,
      userRentalHistories: userData.rentalHistories,
      favoriteGenre: userData.favoriteGenre,
      isLoggedIn: true
    });
  } else {
    const sessionCart = req.session.cart;
    if (!sessionCart) {
      res.json({
        isLoggedIn: false,
      });
    }
    res.json({
      userCarts: sessionCart,
      isLoggedIn: false,
    });
  }
}
