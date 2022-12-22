import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function addReview(req: NextApiRequest, res: NextApiResponse,) {
    const response = await prisma.review.create({
        data:req.body
    })
}
