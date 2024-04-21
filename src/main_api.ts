//main


import { MailerGatewayMemory } from './infra/gateway/MailerGateway';
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import { ExpressAdapter } from './infra/http/HttpServer';
import AccountController from './infra/http/AccountController';
import Signup from './application/usecase/Signup';
import GetAccount from './application/usecase/GetAccount';

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const accountDAO = new AccountRepositoryDatabase(connection);
const mailerGateway = new MailerGatewayMemory();
const signup = new Signup(accountDAO, mailerGateway);
const getAccount = new GetAccount(accountDAO);
new AccountController(httpServer, signup, getAccount);
httpServer.listen(3000);

// app.post('/request_ride', async function (req, res) {
//   try {
//     const accountDAO = new AccountRepositoryDatabase(connection);
//     const rideDAO = new RideRepositoryDatabase(connection);
//     const requestRide = new RequestRide(accountDAO, rideDAO);
//     const resultOfRequestRide = await requestRide.execute(req.body);
//     res.json(resultOfRequestRide);
//   } catch (error) {
//     res.status(422).json(`Some error ocurred in request_ride ${error}`);
//   }
// });

// app.listen(3000, () => {
//   console.log(`Server running on port 3000 ⛇`);
// });
