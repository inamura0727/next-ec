import console from 'console';
import { NextApiRequest, NextApiResponse } from 'next'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
    console.log(`ここまできてる：${req.body.price}`)
    try {
      // throw new Error('エラー!!!!!!')
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
        // success_url: `${req.headers.origin}/?success=true`,
        // cancel_url: `${req.headers.origin}/?canceled=true`,
      });
      res.redirect(303, session.url);
    } catch (err:any) {
      // console.log
      // res.status(err.statusCode || 500).json(err.message);
      res.redirect(`${req.headers.origin}/payment?error=true`);
    }
  } else {
    // res.setHeader('Allow', 'POST');
    // res.status(405).end('Method Not Allowed');
    res.redirect(`${req.headers}/payment?error=true`);
  }
}
