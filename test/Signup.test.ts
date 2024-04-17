import GetAccount from '../src/application/usecase/GetAccount';
import Signup from '../src/application/usecase/Signup';
import crypto from 'crypto';
import sinon from 'sinon';
import { MailerGatewayMemory } from '../src/infra/gateway/MailerGateway';
import { AccountRepositoryDatabase, AcountRepositoryMemory } from '../src/infra/repository/AccountRepository';
import { PgPromiseAdapter } from '../src/infra/database/databaseConnection';
import Account from '../src/domain/Account';

let signup: Signup;
let getAccount: GetAccount;

//Integration test with unit test
beforeEach(() => {
  // Implementation of fake (AccountDAOMemory and MailerGatewayMemory)
  const accoutDAO = new AcountRepositoryMemory();
  const mailerGateway = new MailerGatewayMemory();
  signup = new Signup(accoutDAO, mailerGateway);
  getAccount = new GetAccount(accoutDAO);
});

test('Deve criar a conta de um passageiro', async function () {
  const account = Account.create('Jhon Doe', `john.doe${Math.random()}@gmail.com`, '87748248800', '', true, false)
  const resultOfSignup = await signup.execute(account);
  const resultOfGetAccount = await getAccount.execute(resultOfSignup.accountId);
  expect(resultOfSignup.accountId).toBeDefined();
  expect(resultOfGetAccount.name).toBe(account.name);
  expect(resultOfGetAccount.email).toBe(account.email);
  expect(resultOfGetAccount.cpf).toBe(account.cpf);
});

test('Nao deve criar a conta de um passageiro com o nome inválido', async function () {
  const account = Account.create('', `john.doe${Math.random()}@gmail.com`, '87748248800', '', true, false)
  await expect(signup.execute(account)).rejects.toThrow(new Error('Invalid name'));
});

test('Nao deve criar a conta de um passageiro com o email inválido', async function () {
  const account = Account.create('John Doe', `john.doe${Math.random()}`, '87748248800', '', true, false)
  await expect(signup.execute(account)).rejects.toThrow(new Error('Invalid email'));
});

test('Nao deve criar a conta de um passageiro com o cpf inválido', async function () {
  const account = Account.create('', `john.doe${Math.random()}@gmail.com`, '000000000000', '', true, false)
  await expect(signup.execute(account)).rejects.toThrow(new Error('Invalid cpf'));
});

test('Nao deve criar a conta de um passageiro com a conta já existente', async function () {
  const account = Account.create('Jhon Doe', `john.doe${Math.random()}@gmail.com`, '87748248800', '', true, false)
  await signup.execute(account);
  await expect(signup.execute(account)).rejects.toThrow(new Error('Account already exists'));
});

test('Deve criar a conta de um motorista', async function () {
  const account = Account.create('Jhon Doe', `john.doe${Math.random()}@gmail.com`, '87748248800', 'JKJ3781', false, true)
  const resultOfSignup = await signup.execute(account);
  const resultOfGetAccount = await getAccount.execute(resultOfSignup.accountId);
  expect(resultOfSignup.accountId).toBeDefined();
  expect(resultOfGetAccount.name).toBe(account.name);
  expect(resultOfGetAccount.email).toBe(account.email);
  expect(resultOfGetAccount.cpf).toBe(account.cpf);
});

test('Não deve criar a conta de um motorista com a placa inválida', async function () {
  const account = Account.create('Jhon Doe', `john.doe${Math.random()}@gmail.com`, '87748248800', 'KKKKKK', false, true)
  await expect(signup.execute(account)).rejects.toThrow(new Error('Invalid car plate'));
});

test('Não deve pegar a conta com o id errado', async function () {
  const randomAccountId = crypto.randomUUID();
  await expect(getAccount.execute(randomAccountId)).rejects.toThrow(new Error('Account not found'));
});

test('Deve criar a conta para um passageiro com stub', async function () {
  const account = Account.create('Jhon Doe', `john.doe${Math.random()}@gmail.com`, '87748248800', '', true, false)

  const saveAccountStub = sinon.stub(AccountRepositoryDatabase.prototype, 'saveAccount').resolves();
  const getAccountByEmailStub = sinon.stub(AccountRepositoryDatabase.prototype, 'getByEmail').resolves(undefined);
  // const getAccountByIdStub = sinon.stub(AccountRepositoryDatabase.prototype, 'getById').resolves(input);
  const connection = new PgPromiseAdapter()
  const accountDAO = new AccountRepositoryDatabase(connection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountDAO, mailerGateway);
  const getAccount = new GetAccount(accountDAO);
  const resultOfSignup = await signup.execute(account);
  expect(resultOfSignup.accountId).toBeDefined();
  const resultGetAccount = await getAccount.execute(resultOfSignup.accountId);
  expect(resultGetAccount.name).toBe(account.name);
  expect(resultGetAccount.email).toBe(account.email);
  expect(resultGetAccount.cpf).toBe(account.cpf);
  saveAccountStub.restore();
  getAccountByEmailStub.restore();
  // getAccountByIdStub.restore();
  connection.close();
});

test('Deve criar a conta de um passageiro com spy', async function () {
  const account = Account.create('Jhon Doe', `john.doe${Math.random()}@gmail.com`, '87748248800', '', true, false)
  const saveAccountSpy = sinon.spy(AccountRepositoryDatabase.prototype, 'saveAccount');
  const connection = new PgPromiseAdapter()
  const accountDAO = new AccountRepositoryDatabase(connection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountDAO, mailerGateway);
  const getAccount = new GetAccount(accountDAO);
  const resultOfSignup = await signup.execute(account);
  expect(resultOfSignup.accountId).toBeDefined();
  const resultGetAccount = await getAccount.execute(resultOfSignup.accountId);
  expect(resultGetAccount.name).toBe(account.name);
  expect(resultGetAccount.email).toBe(account.email);
  expect(resultGetAccount.cpf).toBe(account.cpf);
  expect(saveAccountSpy.calledWith(account)).toBe(true); // Use spy to confirm with saveAccount receive input.
  saveAccountSpy.restore();
  connection.close();
});

test('Deve criar uma conta para o passageiro com mock', async function () {
  // Mixes the stub with spy creating expectations in the object itself
  const account = Account.create('Jhon Doe', `john.doe${Math.random()}@gmail.com`, '87748248800', '', true, false)
  const sendMock = sinon.mock(MailerGatewayMemory.prototype);
  sendMock
    .expects('send')
    .withArgs(account.email, 'Welcome', '')
    .once()
    .callsFake(async function () {
      console.log('abc');
    })
    .resolves();
  const connection = new PgPromiseAdapter()
  const accountDAO = new AccountRepositoryDatabase(connection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountDAO, mailerGateway);
  const getAccount = new GetAccount(accountDAO);
  const resultOfSignup = await signup.execute(account);
  expect(resultOfSignup.accountId).toBeDefined();
  const resultOfGetAccount = await getAccount.execute(resultOfSignup.accountId);
  expect(resultOfGetAccount.name).toBe(account.name);
  expect(resultOfGetAccount.email).toBe(account.email);
  expect(resultOfGetAccount.cpf).toBe(account.cpf);
  sendMock.verify();
  sendMock.restore();
  connection.close();
});
