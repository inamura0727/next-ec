import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { User, UserCart } from 'types/user';
import { ironOptions } from '../../../lib/ironOprion';
import prisma from '../../../lib/prisma';

export default withIronSessionApiRoute(addLogedinCart, ironOptions);

async function addLogedinCart(req: NextApiRequest, res: NextApiResponse) {
    if (req.session.user) {
        const userId = req.session.user.userId;
        if (req.session.cart) {
            // sessionのカートからcartId以外を取得
            const sessionCart = req.session.cart.map((item) => {
                const data = {
                    itemId: item.itemId,
                    userId: userId,
                    rentalPeriod: item.rentalPeriod
                }
                return data;
            })
            // cartテーブルに追加
            const result = await prisma.cart.createMany({
                data: sessionCart
            })
            // sessionのカートを空にする
            req.session.cart = []
        }
        res.redirect('/')
    }else{
        res.redirect('/error')
    }
}
