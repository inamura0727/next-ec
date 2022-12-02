import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserCart, RentalHistory } from '../../types/user';

export default withIronSessionApiRoute(getUserRoute, ironOptions);

export type SessionUser = {
  userId?: number;
  userCarts?: UserCart[];
  userRentalHistories?: RentalHistory[];
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
    const userData = await result.json();
    const cart: UserCart[] = userData.userCarts;
    // ID昇順
    cart.sort((a, b) => {
      return a.id - b.id;
    });
    res.json({
      userId: req.session.user.id,
      userCarts: cart,
      userRentalHistories: userData.rentalHistories,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
}
