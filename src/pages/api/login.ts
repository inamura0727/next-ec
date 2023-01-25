import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import axios from 'axios';

export default withIronSessionApiRoute(async function loginRoute(
  req,
  res
) {
  const result = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
    {
      mailAddress: req.body.mailAddress,
      password: req.body.password,
    }
  );

  const user = result.data;
  if (user) {
    req.session.user = {
      userId: user[0].userId,
      userName: user[0].userName,
    };
    await req.session.save();
    res.status(200).end();
  } else {
    res.status(404).end();
  }
},
ironOptions);
