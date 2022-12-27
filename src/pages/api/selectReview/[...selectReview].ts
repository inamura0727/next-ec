import { NextApiRequest, NextApiResponse } from 'next';

export const selectReview = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let itemId;
  const { selectReview } = req.query;
  console.log(selectReview);
  if (Array.isArray(selectReview)) {
    itemId = Number(selectReview[0]);
  } else {
    return res.redirect('/error');
  }
  const result = await prisma.review.findMany({
    where: {
      itemId: itemId,
    },
    take: 5,
  });

  res.json({ data: result });
};

export default selectReview;
