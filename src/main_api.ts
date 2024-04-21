//main


import { MailerGatewayMemory } from './infra/gateway/MailerGateway';
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import { ExpressAdapter, HapiAdapter } from './infra/http/HttpServer';
import AccountController from './infra/http/AccountController';
import Signup from './application/usecase/Signup';
import GetAccount from './application/usecase/GetAccount';

const httpServer = new ExpressAdapter();
// const httpServer = new HapiAdapter();
const connection = new PgPromiseAdapter();
const accountDAO = new AccountRepositoryDatabase(connection);
const mailerGateway = new MailerGatewayMemory();
const signup = new Signup(accountDAO, mailerGateway);
const getAccount = new GetAccount(accountDAO);
new AccountController(httpServer, signup, getAccount);
httpServer.listen(3000);


