import { AccountRepositoryDatabase } from '../src/infra/repository/AccountRepository';
import { PgPromiseAdapter } from '../src/infra/database/databaseConnection';
import Account from '../src/domain/Account';

//Integration test

test('Deve salvar um registro de passageiro na tabela account e consultar um registro por id', async function () {
  const account = Account.create('John Doe', `john.doe${Math.random()}@gmail.com`, '87748248800', '', true, false);
  let connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  await accountRepository.saveAccount(account);
  const accountBydId = await accountRepository.getById(account.accountId);
  expect(account.accountId).toBe(accountBydId.accountId);
  expect(account.email).toBe(accountBydId.email);
  expect(account.cpf).toBe(accountBydId.cpf);
  await connection.close();
});

test('Deve salvar um registro de motorista na tabela account e consultar um registro por email', async function () {
  const account = Account.create('John Doe', `john.doe${Math.random()}@gmail.com`, '87748248800', 'JKJ3781', false, true);
  const connection = new PgPromiseAdapter();
  const accountDAO = new AccountRepositoryDatabase(connection);
  await accountDAO.saveAccount(account);
  const accountBydId = await accountDAO.getByEmail(account.email);
  expect(account.accountId).toBe(accountBydId?.accountId);
  expect(account.email).toBe(accountBydId?.email);
  expect(account.cpf).toBe(accountBydId?.cpf);
  await connection.close();
});
