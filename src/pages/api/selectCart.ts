import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { User, UserCart, RentalHistory } from '../../types/user';
import prisma from '../../../lib/prisma';

export default withIronSessionApiRoute(CartRoute, ironOptions);

async function CartRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    const userId = req.session.user.userId;
    // console.log(userId);
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

    if (!data) {
      return {
        redirect: {
          destination: '/error',
        },
      };
    }
    res.json({
      userCarts: data.carts,
      isLoggedIn: true,
    });
  } else {
    const sessionCart = req.session.cart;
    console.log(sessionCart);
    if (!sessionCart) {
      res.json({
        userCarts: [],
        isLoggedIn: false,
      });
    } else {
      const carts = await Promise.all(
        sessionCart.map(async (cart) => {
          const data = await prisma.item.findUnique({
            where: {
              itemId: cart.itemId,
            },
          });
          // cart.items = data;
          return cart;
        })
      );
      console.log('hoge');
      console.log(carts);
      res.json({
        userCarts: carts,
        isLoggedIn: false,
      });
    }
  }
}
