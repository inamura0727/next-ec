import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';

export default withIronSessionApiRoute(async (req, res) => {
  const { id } = await req.body;
  const { detail } = await req.body;
  const carts = req.session.cart;

  try {
    if (carts) {
      if (detail) {
        const fil = carts.filter((cartItem) => {
          return cartItem.itemId !== id;
        });

        const newFil = [];
        for (let item of fil) {
          newFil.push({
            id: newFil.length + 1,
            itemId: item.itemId,
            itemName: item.itemName,
            itemImage: item.itemImage,
            price: item.price,
            rentalPeriod: item.rentalPeriod,
          });
        }

        console.log(newFil);
        req.session.cart = newFil;
      } else {
        const fil = carts.filter((cartItem) => {
          return cartItem.id !== id;
        });

        const newFil = [];
        for (let item of fil) {
          newFil.push({
            id: newFil.length + 1,
            itemId: item.itemId,
            itemName: item.itemName,
            itemImage: item.itemImage,
            price: item.price,
            rentalPeriod: item.rentalPeriod,
          });
        }
        req.session.cart = newFil;
      }
    }
    await req.session.save();
  } catch {
    console.log('エラー');
  }
  // res.status(200).end();
  res.json({
    message: '削除できました',
  });
}, ironOptions);
