import { NextApiRequest, NextApiResponse } from 'next';

const handler = (_: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('WWW-Authenticate', 'Basic realm="Secure Demo Site"');
  res.status(401);
  res.end('Auth Required.');
};

export default handler;
