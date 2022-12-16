import { NextApiRequest, NextApiResponse } from 'next';
import { Item } from 'types/item';
import { config } from '../../config/index';

export default async function getTotalCount(req: NextApiRequest, res: NextApiResponse,) {
    const {genre, keyword} = req.body;
      const response = await fetch(
        `http://localhost:8000/items?categories_like=${genre}&q=${keyword}`
        
      );
      const items: Array<Item> = await response.json();
      return res.json({count: items.length});
}
