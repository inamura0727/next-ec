import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserCart } from '../../types/user';

export default withIronSessionApiRoute(getSessionRoute, ironOptions);

export type SessionUser = {
  userId?: number;
  userCarts?: UserCart[];
  isLoggedIn: boolean;
};

async function getSessionRoute(
  req: NextApiRequest,
  res: NextApiResponse<SessionUser>
) {
  console.log(req.session.user);
  if (req.session.user) {
    res.json({
      userId: req.session.user.userId,
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
