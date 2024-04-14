import express from 'express';
import Signup from '../application/usecase/Signup';
import GetAccount from '../application/usecase/GetAccount';
import { MailerGatewayMemory } from './Gateway/MailerGateway';
import { AccountDAODatabase } from './DAODatabase/AccountDAODatabase';
import { RideDAODatabase } from './DAODatabase/RideDAODatabase';
import RequestRide from '../application/usecase/RequestRide';
import GetRide from '../application/usecase/GetRide';
const app = express();
app.use(express.json());

app.post('/signup', async function (req, res) {
  try {
    const accountDAO = new AccountDAODatabase();
    const mailerGateway = new MailerGatewayMemory();
    const signup = new Signup(accountDAO, mailerGateway);
    const resultOfSignup = await signup.execute(req.body);
    res.json(resultOfSignup);
  } catch (error: any) {
    res.status(422).json({
      error: `Some error ocurred in signup ${error}`,
    });
  }
});

app.get('/getAccountById/:accountId', async function (req, res) {
  const accountDAO = new AccountDAODatabase();
  const getAccount = new GetAccount(accountDAO);
  const resultOfGetAccount = await getAccount.execute(req.params.accountId);
  res.json(resultOfGetAccount);
});

app.get('/getRideById/:rideId', async function (req, res) {
  try {
    const accountDAO = new AccountDAODatabase();
    const rideDAO = new RideDAODatabase();
    const getRide = new GetRide(accountDAO, rideDAO);
    const resultOfGetRide = await getRide.execute(req.params.rideId)
    res.json(resultOfGetRide)
  } catch (error) {
    res.status(422).json(`Some error ocurred in getRide ${error}`)
  }
})

app.post('/request_ride', async function (req, res) {
  try {
    const accountDAO = new AccountDAODatabase();
    const rideDAO = new RideDAODatabase();
    const requestRide = new RequestRide(accountDAO, rideDAO);
    const resultOfRequestRide = await requestRide.execute(req.body)
    res.json(resultOfRequestRide)
  } catch (error) {
    res.status(422).json(`Some error ocurred in request_ride ${error}`)
  }
})


app.listen(3000, () => {
  console.log(`Server running on port 3000 ⛇`);
});
