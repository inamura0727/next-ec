import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import prisma from '../../../lib/prisma';

export default withIronSessionApiRoute(async function loginRoute(
  req,
  res
) {
  // const response = await fetch(
  //   `http://localhost:8000/users?mailAddress=${req.body.formValues.mailAddress}`,
  //   {
  //     //Jsonファイルに送る
  //     method: 'GET',
  //   }
  // );
  const item = await prisma.user.findMany({
    where: {
      mailAddress : req.body.formValues.mailAddress,
    },
  });

  if (item) {
    res.json({result: false ,message: 'このメールアドレスはすでに登録済みです'});
  } else {
    res.json({result: true});
  }
},
ironOptions);
