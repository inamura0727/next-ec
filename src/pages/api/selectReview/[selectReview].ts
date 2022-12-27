import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export const selectReview = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let itemId;
  const { selectReview } = req.query;
  itemId = Number(selectReview);
  const result = await prisma.review.findMany({
    where: {
      itemId: itemId,
    },
    take: 5,
  });

  res.json({ data: result });
};

export default selectReview;
