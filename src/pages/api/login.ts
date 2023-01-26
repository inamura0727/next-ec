import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import axios from 'axios';

export default withIronSessionApiRoute(async function loginRoute(
  req,
  res
) {
  try {
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
      res.json({
        message: []
      });
    } else {
      res.status(404).end();
    }
  } catch (e: any) {
    const messeage = e.response.data.message;
    res.json({
      message: messeage,
    });
  }
},
ironOptions);
