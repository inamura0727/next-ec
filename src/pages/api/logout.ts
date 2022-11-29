import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next'

function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy()
  res.status(200).end();
}

export default withIronSessionApiRoute(logoutRoute, ironOptions)
