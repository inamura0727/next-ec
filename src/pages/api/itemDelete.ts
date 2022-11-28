import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';

export default withIronSessionApiRoute(async (req, res) => {
  const { id } = await req.body;
  const carts = req.session.cart;
  console.log(id);
  // console.log(carts);

  try {
    if (carts) {
      const fil = carts.filter((cartItem) => {
        return cartItem.id !== id;
      });
      req.session.cart = fil;
    }
    await req.session.save();
    // console.log(req.session.cart);
  } catch {
    console.log('エラー');
  }
  // res.status(200).end();
  res.json({
    message: '削除できました',
  });
}, ironOptions);
