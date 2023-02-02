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
    if (result.data.result === false) {
      res.json({
        message: result.data.message,
      });
      return;
    } else {
      const user = result.data.user;
      req.session.user = {
        userId: user[0].userId,
        userName: user[0].userName,
      };
      await req.session.save();
      res.json({
        message: 'ok',
      });
    }
  } catch (e: any) {
    const message = e.response.data.message;
    res.json({
      message: message,
    });
  }
},
ironOptions);
