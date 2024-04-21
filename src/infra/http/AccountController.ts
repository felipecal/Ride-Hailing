// Interface Adapter

import GetAccount from "../../application/usecase/GetAccount";
import Signup from "../../application/usecase/Signup";
import HttpServer from "./HttpServer";


export default class AccountController {
  constructor(readonly httpserver: HttpServer, readonly signup: Signup, readonly getAccount: GetAccount){
    httpserver.register("post", '/signup', async function(params: any, body: any){
      const outputSignup = await signup.execute(body);
      return outputSignup;

    })

    
    httpserver.register("get", "/getAccountById/:accountId", async function(params: any, body: any){
      const outputGetAccount = await getAccount.execute(params.accountId);
      return outputGetAccount;
    })    
  }
}