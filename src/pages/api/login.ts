import { withIronSessionApiRoute } from "iron-session/next";
import {ironOptions} from "../../../lib/ironOprion"
 
export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const response = await fetch(`http://localhost:8000/items/?mailAdddres=${req.body.mailAddres}&passeord=${req.body.password}`, {
      //Jsonファイルに送る
      method: 'GET',
    });
    const items = await response.json();

    if(items[0].mailAddress == req.body.mailAddress && items[0].password == req.body.password){
      req.session.user= {   
        id: items[0].id,
        userName: items[0].userName,
      };
      await req.session.save();
      res.status(200).end();
      console.log("NG");
    }else{
    }
  },
  ironOptions, 
);
