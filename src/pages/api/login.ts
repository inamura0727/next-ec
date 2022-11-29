import { withIronSessionApiRoute } from "iron-session/next";
import {ironOptions} from "../../../lib/ironOprion"
 
export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const response = await fetch(`http://localhost:3000/api/users?mailAddress=${req.body.mailAddress}&password=${req.body.password}`, {
      //Jsonファイルに送る
      method: 'GET',
    });
    const items = await response.json();

    if(items[0]){
      req.session.user= {   
        id: items[0].id,
        userName: items[0].userName,
      };
      await req.session.save();
      res.status(200).end();
    }else{
      res.status(404).end();
    }
  },
  ironOptions, 
);
