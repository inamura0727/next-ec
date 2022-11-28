import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';

export default withIronSessionApiRoute(loginRoute, ironOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();

  req.session.user = {
    /* ↓好きな情報に変更可能 */
    id: 1,
    userName: 'デモユーザー',
    userCarts: [],
  };

  await req.session.save();

  /* ↓飛ばしたい画面に変更可能 */
  res.redirect('/top');
}
