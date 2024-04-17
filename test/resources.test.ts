import crypto from 'crypto';
import { AccountRepositoryDatabase } from '../src/infra/repository/AccountRepository';
import { PgPromiseAdapter } from '../src/infra/database/databaseConnection';

//Integration test

test.skip('Deve salvar um registro de passageiro na tabela account e consultar um registro por id', async function () {
  const account = {
    accountId: crypto.randomUUID(),
    name: '',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPLate: '',
    isPassenger: true,
    isDriver: false
  };
  const connection = new PgPromiseAdapter()
  const accountDAO = new AccountRepositoryDatabase(connection);
  await accountDAO.saveAccount(account);
  const accountBydId = await accountDAO.getById(account.accountId);
  expect(account.accountId).toBe(accountBydId.accountId);
  expect(account.email).toBe(accountBydId.email);
  expect(account.cpf).toBe(accountBydId.cpf);
  connection.close()
});

test('Deve salvar um registro de motorista na tabela account e consultar um registro por email', async function () {
  const account = {
    accountId: crypto.randomUUID(),
    name: '',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: false,
    isDriver: true,
    carPlate: 'JKJ3781',
  };
  const connection = new PgPromiseAdapter()
  const accountDAO = new AccountRepositoryDatabase(connection);
  await accountDAO.saveAccount(account);
  const accountBydId = await accountDAO.getByEmail(account.email);
  expect(account.accountId).toBe(accountBydId?.accountId);
  expect(account.email).toBe(accountBydId?.email);
  expect(account.cpf).toBe(accountBydId?.cpf);
  connection.close()
});
