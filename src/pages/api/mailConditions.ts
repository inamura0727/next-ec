import axios from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import prisma from '../../../lib/prisma';

export default withIronSessionApiRoute(async function loginRoute(
  req,
  res
) {
  // const item = await prisma.user.findMany({
  //   where: {
  //     mailAddress : req.body.formValues.mailAddress,
  //   },
  // });
  // const result = await axios.post()

  // if (item[0] ) {
  //   res.json({result: false ,message: 'このメールアドレスはすでに登録済みです'});
  // } else {
  //   res.json({result: true});
  // }
},
ironOptions);
