import { AccountRepository } from './../src/infra/repository/AccountRepository';
import GetRide from '../src/application/usecase/GetRide';
import RequestRide from '../src/application/usecase/RequestRide';
import Signup from '../src/application/usecase/Signup';
import { PgPromiseAdapter } from '../src/infra/database/DatabaseConnection';
import { MailerGatewayMemory } from '../src/infra/gateway/MailerGateway';
import { AccountRepositoryDatabase } from '../src/infra/repository/AccountRepository';
import { RideRepositoryDatabase } from '../src/infra/repository/RideRepository';
import Account from '../src/domain/Account';
import Ride from '../src/domain/Ride';

test('Deve solicitar uma nova corrida', async function () {
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const mailerGateway = new MailerGatewayMemory();
  const getRide = new GetRide(accountRepository, rideRepository);
  const signup = new Signup(accountRepository, mailerGateway);
  const account = Account.create('John Doe', `john.doe${Math.random()}@gmail.com`, '87748248800', '', true, false);
  const resultSignup = await signup.execute(account);
  const ride = Ride.create(resultSignup.accountId, -27.584905257808835, -48.545022195325124, -27.496887588317275, -48.522234807851476);
  const requestRide = new RequestRide(accountRepository, rideRepository);
  const resultOfRequestRide = await requestRide.execute(ride);
  expect(resultOfRequestRide).toBeDefined();
  const resultOfGetRide = await getRide.execute(resultOfRequestRide.rideId);
  expect(resultOfGetRide.status).toBe('requested');
  expect(resultOfGetRide.passengerName).toBe(account.name);
  expect(resultOfGetRide.passengerEmail).toBe(account.email);
  await connection.close();
});

test('Não deve poder solicitar uma nova corrida se não for um passageiro', async function () {
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const account = Account.create('John Doe', `john.doe${Math.random()}@gmail.com`, '87748248800', 'KAL9911', false, true);
  const resultSignup = await signup.execute(account);
  const ride = Ride.create(resultSignup.accountId, -27.584905257808835, -48.545022195325124, -27.496887588317275, -48.522234807851476);
  const requestRide = new RequestRide(accountRepository, rideRepository);
  expect(requestRide.execute(ride)).rejects.toThrow(new Error('Not is a passenger'));
  await connection.close();
});

test('Não deve poder solicitar uma nova corrida se o passageiro tiver outra corrida ativa', async function () {
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const account = Account.create('John Doe', `john.doe${Math.random()}@gmail.com`, '87748248800', '', true, false);
  const resultSignup = await signup.execute(account);
  const requestRide = new RequestRide(accountRepository, rideRepository);
  const ride = Ride.create(resultSignup.accountId, -27.584905257808835, -48.545022195325124, -27.496887588317275, -48.522234807851476);
  await requestRide.execute(ride);
  await expect(requestRide.execute(ride)).rejects.toThrow(new Error('Passenger already has a active ride'));
  await connection.close();
});
