import GetAccount from '../src/application/usecase/GetAccount';
import Signup from '../src/application/usecase/Signup';
import crypto from 'crypto';
import sinon from 'sinon';
import { MailerGatewayMemory } from '../src/infra/gateway/MailerGateway';
import { AccountRepositoryDatabase, AcountRepositoryMemory } from '../src/infra/repository/AccountRepository';
import { PgPromiseAdapter } from '../src/infra/database/DatabaseConnection';
import Account from '../src/domain/entity/Account';

let signup: Signup;
let getAccount: GetAccount;

//Integration test with unit test
beforeEach(() => {
  // Implementation of fake (AccountDAOMemory and MailerGatewayMemory)
  const accoutRepository = new AcountRepositoryMemory();
  const mailerGateway = new MailerGatewayMemory();
  signup = new Signup(accoutRepository, mailerGateway);
  getAccount = new GetAccount(accoutRepository);
});

test('Deve criar a conta de um passageiro', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: '',
    isPassenger: true,
    isDriver: false,
  };
  const resultOfSignup = await signup.execute(input);
  const resultOfGetAccount = await getAccount.execute(resultOfSignup.accountId);
  expect(resultOfSignup.accountId).toBeDefined();
  expect(resultOfGetAccount.name).toBe(input.name);
  expect(resultOfGetAccount.email).toBe(input.email);
  expect(resultOfGetAccount.cpf).toBe(input.cpf);
});

test('Nao deve criar a conta de um passageiro com o nome inválido', async function () {
  const input = {
    name: 'John',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: '',
    isPassenger: true,
    isDriver: false,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid name'));
});

test('Nao deve criar a conta de um passageiro com o email inválido', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}`,
    cpf: '87748248800',
    carPlate: '',
    isPassenger: true,
    isDriver: false,
  };
  await expect(signup.execute(input)).rejects.toThrow(new Error('Invalid email'));
});

test('Nao deve criar a conta de um passageiro com o cpf inválido', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '8774824',
    carPlate: '',
    isPassenger: true,
    isDriver: false,
  };
  await expect(signup.execute(input)).rejects.toThrow(new Error('Invalid cpf'));
});

test('Não deve criar uma conta para o passageiro se a conta já existe', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: '',
    isPassenger: true,
    isDriver: false,
  };
  await signup.execute(input);
  await expect(() => signup.execute(input)).rejects.toThrow(new Error('Account already exists'));
});

test('Deve criar a conta de um motorista', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: 'AAA9999',
    isPassenger: false,
    isDriver: true,
  };
  const resultOfSignup = await signup.execute(input);
  const resultOfGetAccount = await getAccount.execute(resultOfSignup.accountId);
  expect(resultOfSignup.accountId).toBeDefined();
  expect(resultOfGetAccount.name).toBe(input.name);
  expect(resultOfGetAccount.email).toBe(input.email);
  expect(resultOfGetAccount.cpf).toBe(input.cpf);
});

test('Não deve criar a conta de um motorista com a placa inválida', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: 'KKKKKKKK',
    isPassenger: false,
    isDriver: true,
  };
  await expect(signup.execute(input)).rejects.toThrow(new Error('Invalid car plate'));
});

test('Não deve pegar a conta com o id errado', async function () {
  const randomAccountId = crypto.randomUUID();
  await expect(getAccount.execute(randomAccountId)).rejects.toThrow(new Error('Account not found'));
});

test('Deve criar a conta para um passageiro com stub', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: '',
    isPassenger: true,
    isDriver: false,
  };
  const connection = new PgPromiseAdapter();
  const saveAccountStub = sinon.stub(AccountRepositoryDatabase.prototype, 'saveAccount').resolves();
  const getAccountByEmailStub = sinon.stub(AccountRepositoryDatabase.prototype, 'getByEmail').resolves(undefined);
  const getAccountByIdStub = sinon
    .stub(AccountRepositoryDatabase.prototype, 'getById')
    .resolves(Account.restore('', input.name, input.email, input.cpf, '', true, false));
  const accountRepository = new AccountRepositoryDatabase(connection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const getAccount = new GetAccount(accountRepository);
  const resultOfSignup = await signup.execute(input);
  expect(resultOfSignup.accountId).toBeDefined();
  const resultGetAccount = await getAccount.execute(resultOfSignup.accountId);
  expect(resultGetAccount.name).toBe(input.name);
  expect(resultGetAccount.email).toBe(input.email);
  expect(resultGetAccount.cpf).toBe(input.cpf);
  saveAccountStub.restore();
  getAccountByEmailStub.restore();
  getAccountByIdStub.restore();
  await connection.close();
});

test('Deve criar a conta de um passageiro com spy', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: '',
    isPassenger: true,
    isDriver: false,
  };
  const sendSpy = sinon.spy(MailerGatewayMemory.prototype, 'send');
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const getAccount = new GetAccount(accountRepository);
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(sendSpy.calledOnce).toBe(true);
  expect(sendSpy.calledWith(input.email, 'Welcome!', '')).toBe(true);
  sendSpy.restore();
  await connection.close();
});

test('Deve criar uma conta para o passageiro com mock', async function () {
  // Mixes the stub with spy creating expectations in the object itself
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: '',
    isPassenger: true,
    isDriver: false,
  };
  const sendMock = sinon.mock(MailerGatewayMemory.prototype);
  sendMock
    .expects('send')
    .withArgs(input.email, 'Welcome!', '')
    .once()
    .callsFake(async function () {
      console.log('abc');
    })
    .resolves();
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const getAccount = new GetAccount(accountRepository);
  const resultOfSignup = await signup.execute(input);
  expect(resultOfSignup.accountId).toBeDefined();
  const resultOfGetAccount = await getAccount.execute(resultOfSignup.accountId);
  expect(resultOfGetAccount.name).toBe(input.name);
  expect(resultOfGetAccount.email).toBe(input.email);
  expect(resultOfGetAccount.cpf).toBe(input.cpf);
  sendMock.verify();
  sendMock.restore();
  await connection.close();
});
