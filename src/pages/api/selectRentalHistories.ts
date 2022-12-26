import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';

export default withIronSessionApiRoute(async function rentalHistory(

    res
  ) {
    const item = await prisma.rentalHistory.findMany({
      where: {
        // userId : Number(req.body.userId),
        userId :2,
      },
    });

    // res.status(200);
  },
  ironOptions);
