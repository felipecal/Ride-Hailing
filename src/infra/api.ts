import express from 'express';
import Signup from '../application/usecase/Signup';
import GetAccount from '../application/usecase/GetAccount';
import { MailerGatewayMemory } from './Gateway/MailerGateway';
import { AccountDAODatabase } from './DAODatabase/AccountDAODatabase';
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

app.listen(3000, () => {
  console.log(`Server running on port 3000 ⛇`);
});
