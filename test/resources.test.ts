import crypto from 'crypto';
import { AccountRepositoryDatabase } from '../src/infra/Repository/AccountRepository';

//Integration test

test('Deve salvar um registro de passageiro na tabela account e conulstar um registro por id', async function () {
  const account = {
    accountId: crypto.randomUUID(),
    name: '',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  const accountDAO = new AccountRepositoryDatabase();
  await accountDAO.saveAccount(account);
  const accountBydId = await accountDAO.getById(account.accountId);
  expect(account.accountId).toBe(accountBydId.account_id);
  expect(account.email).toBe(accountBydId.email);
  expect(account.cpf).toBe(accountBydId.cpf);
});

test('Deve salvar um registro de motorista na tabela account e conulstar um registro por email', async function () {
  const account = {
    accountId: crypto.randomUUID(),
    name: '',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: false,
    isDriver: true,
    carPlate: 'JKJ3781',
  };
  const accountDAO = new AccountRepositoryDatabase();
  await accountDAO.saveAccount(account);
  const accountBydId = await accountDAO.getByEmail(account.email);
  expect(account.accountId).toBe(accountBydId.account_id);
  expect(account.email).toBe(accountBydId.email);
  expect(account.cpf).toBe(accountBydId.cpf);
});
