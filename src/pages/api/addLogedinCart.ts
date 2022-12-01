import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { User, UserCart } from 'types/user';
import { ironOptions } from '../../../lib/ironOprion';

export default withIronSessionApiRoute(addLogedinCart, ironOptions);

async function addLogedinCart(req: NextApiRequest, res: NextApiResponse) {
    if(req.session.user){
        const response = await fetch(`http://localhost:3000/api/users/${req.session.user.id}`);
        const userData: User = await response.json();
        let cart: UserCart[] = userData.userCarts;
        if(req.session.cart){
            const sessionCart = req.session.cart;
            cart.push(...sessionCart);
        }
        const data = { userCarts: cart};
        await fetch(
        `http://localhost:3000/api/users/${req.session.user.id}`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }
        ).then(() => res.redirect('/'))
        }
  }
