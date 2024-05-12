//main

import ProcessPayment from './application/usecase/ProcessPayment';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import { ExpressAdapter, HapiAdapter } from './infra/http/HttpServer';
import Mediator from './infra/mediator/Mediator';
// import AccountController from './infra/http/AccountController';

const httpServer = new ExpressAdapter();
// const httpServer = new HapiAdapter();
const connection = new PgPromiseAdapter();
const mediator = new Mediator();
mediator.register('rideCompleted', async (data: any) => {
  const processPayment = new ProcessPayment();
  await processPayment.execute(data);
});
httpServer.listen(3000);
// const accountRepository = new AccountRepositoryDatabase(connection);
// const mailerGateway = new MailerGatewayMemory();
// const getAccount = new GetAccount(accountRepository);
// new AccountController(httpServer, signup, getAccount);
