import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';

export default withIronSessionApiRoute(async function loginRoute(
  req,
  res
) {
  const response = await fetch(
    `http://localhost:3000/api/users?mailAddress=${req.body.formValues.mailAddress}`,
    {
      //Jsonファイルに送る
      method: 'GET',
    }
  );
  const items = await response.json();

  if (items[0]) {
    res.json({result: false ,message: 'このメールアドレスはすでに登録済みです'});
  } else {
    res.json({result: true});
  }
},
ironOptions);
