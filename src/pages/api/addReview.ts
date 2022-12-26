import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function addReview(req: NextApiRequest, res: NextApiResponse,) {
    await prisma.review.create({
        data:req.body
    })
    res.status(200);
}
