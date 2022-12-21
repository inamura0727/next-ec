import { withIronSessionApiRoute } from "iron-session/next";
import {ironOptions} from "../../../lib/ironOprion"
import prisma from "../../../lib/prisma";
 
export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const item = await prisma.user.findMany({
      where: {
        mailAddress: req.body.mailAddress,
        password: req.body.password
      }
    })

    if(item[0]){
      req.session.user= {   
        id: item[0].userId,
        userName: item[0].userName,
      };
      await req.session.save();
      res.status(200).end();
    }else{
      res.status(404).end();
    }
  },
  ironOptions, 
);
