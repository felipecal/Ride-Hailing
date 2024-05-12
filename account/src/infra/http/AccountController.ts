// Interface Adapter

import GetAccount from '../../application/usecase/GetAccount';
import Signup from '../../application/usecase/Signup';
import HttpServer from './HttpServer';

export default class AccountController {
  constructor(
    readonly httpServer: HttpServer,
    readonly signup: Signup,
    readonly getAccount: GetAccount,
  ) {
    httpServer.register('post', '/signup', async function (params: any, body: any) {      
      const outputSignup = await signup.execute(body);
      return outputSignup;
    });

    httpServer.register('get', '/getAccountById/:accountId', async function (params: any, body: any) {
      const outputGetAccount = await getAccount.execute(params.accountId);
      return outputGetAccount;
    });
  }
}
