import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';

export default withIronSessionApiRoute(async (req, res) => {
  const { cart } = await req.body;
  const carts = req.session.cart;
  try {
    if (carts) {
      carts?.push(cart);
    } else {
      req.session.cart = [cart];
    }
    await req.session.save();
    console.log(req.session.cart);
  } catch {
    console.log('エラー');
  }
  res.status(200).end();
}, ironOptions);
