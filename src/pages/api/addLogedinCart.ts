import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { User, UserCart } from 'types/user';
import { ironOptions } from '../../../lib/ironOprion';

export default withIronSessionApiRoute(addLogedinCart, ironOptions);

async function addLogedinCart(req: NextApiRequest, res: NextApiResponse) {
    if(req.session.user){
        const response = await fetch(`http://localhost:3000/api/users/${req.session.user.id}`);
        const userData: User = await response.json();
        const userCart: UserCart[] = userData.userCarts;
        if(req.session.cart){
            // userのカートにsessionのカートをマージ
            
            let sessionCart = req.session.cart;
            for(let item of sessionCart){
                userCart.push({id: (userCart.length + 1) , itemId: item.itemId, itemName: item.itemName, rentalPeriod: item.rentalPeriod, price: item.price, itemImage: item.itemImage});
            }
            
            // sessionのカートを空にする
            sessionCart = []
        }
        const data = { userCarts: userCart};
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
