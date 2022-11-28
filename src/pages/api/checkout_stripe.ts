import { NextApiRequest, NextApiResponse } from 'next'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'jpy',
              product_data: {
                name: 'フェスタル 動画レンタル',
              },
              unit_amount: req.body.price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/paymentComp`,
        cancel_url: `${req.headers.origin}/payment`,
      });
      res.redirect(303, session.url);
    } catch (err:any) {
      res.redirect(`${req.headers.origin}/payment?error=true`);
    }
  } else {
    res.redirect(`${req.headers}/payment?error=true`);
  }
}
