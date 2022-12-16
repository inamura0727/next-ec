import { NextApiRequest, NextApiResponse } from 'next';
import { Item } from 'types/item';
import { Reviews } from 'types/review';
import { config } from '../../config/index';

type Props = Item | Reviews

export default async function getTotalCount(req: NextApiRequest, res: NextApiResponse,) {
    const {url} = req.body;
      const response = await fetch(
        `http://localhost:8000/${url}`
        
      );
      const items: Array<Props> = await response.json();
      return res.json({count: items.length});
}
