import GetAccount from '../src/application/usecase/GetAccount';
import Signup from '../src/application/usecase/Signup';
import crypto from 'crypto';
import { AccountDAODatabase, AcountDAOMemory } from '../src/infra/DAODatabase/AccountDAODatabase';
import { MailgerGatewayMemory } from '../src/infra/Gateway/MailerGateway';

let signup: Signup;
let getAccount: GetAccount;

//Integration test with unit test
beforeEach(() => {
  const accoutDAO = new AcountDAOMemory();
  const mailerGateway = new MailgerGatewayMemory();
  signup = new Signup(accoutDAO, mailerGateway);
  getAccount = new GetAccount(accoutDAO);
});

test('Deve criar a conta de um passageiro', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  const resultOfSignup = await signup.execute(input);
  console.log('resultOfSignup', resultOfSignup);

  const resultOfGetAccount = await getAccount.execute(resultOfSignup.accountId);
  expect(resultOfSignup.accountId).toBeDefined();
  expect(resultOfGetAccount.name).toBe(input.name);
  expect(resultOfGetAccount.email).toBe(input.email);
  expect(resultOfGetAccount.cpf).toBe(input.cpf);
});

test('Nao deve criar a conta de um passageiro com o nome inválido', async function () {
  const input = {
    name: '',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  await expect(signup.execute(input)).rejects.toThrow(new Error('Invalid name'));
});

test('Nao deve criar a conta de um passageiro com o email inválido', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}`,
    cpf: '87748248800',
    isPassenger: true,
  };
  await expect(signup.execute(input)).rejects.toThrow(new Error('Invalid email'));
});

test('Nao deve criar a conta de um passageiro com o cpf inválido', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '000000000000',
    isPassenger: true,
  };
  await expect(signup.execute(input)).rejects.toThrow(new Error('Invalid cpf'));
});

test('Nao deve criar a conta de um passageiro com a conta já existente', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  await signup.execute(input);
  await expect(signup.execute(input)).rejects.toThrow(new Error('Account already exists'));
});

test('Deve criar a conta de um motorista', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: false,
    isDriver: true,
    carPlate: 'JKJ3781',
  };
  const resultOfSignup = await signup.execute(input);
  const resultOfGetAccount = await getAccount.execute(resultOfSignup.accountId);
  expect(resultOfSignup.accountId).toBeDefined();
  expect(resultOfGetAccount.name).toBe(input.name);
  expect(resultOfGetAccount.email).toBe(input.email);
  expect(resultOfGetAccount.cpf).toBe(input.cpf);
});

test('Não deve criar a conta de um motorista com a palca inválida', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: false,
    isDriver: true,
    carPlate: 'KKKKKK',
  };
  await expect(signup.execute(input)).rejects.toThrow(new Error('Invalid car plate'));
});

test('Não deve pegar a conta com o id errado', async function () {
  const randomAccountId = crypto.randomUUID();
  await expect(getAccount.execute(randomAccountId)).rejects.toThrow(new Error('Account not found'));
});
