import GetRide from '../src/application/usecase/GetRide';
import RequestRide from '../src/application/usecase/RequestRide';
import { PgPromiseAdapter } from '../src/infra/database/DatabaseConnection';
import AccountGatewayHttp from '../src/infra/gateway/AccountGatewayHttp';
import { AccountRepositoryDatabase } from '../src/infra/repository/AccountRepository';
import { PositionRepositoryDatabase } from '../src/infra/repository/PositionRepository';
import { RideRepositoryDatabase } from '../src/infra/repository/RideRepository';

test('Deve solicitar uma nova corrida', async function () {
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const positionRepository = new PositionRepositoryDatabase(connection);
  const getRide = new GetRide(accountRepository, rideRepository, positionRepository);
  const accountGateway = new AccountGatewayHttp();
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: '',
    isPassenger: true,
    isDriver: false,
  };
  const resultSignup = await accountGateway.signUp(inputSignup);
  const inputRequestRide = {
    passengerId: resultSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const requestRide = new RequestRide(accountRepository, rideRepository);
  const resultOfRequestRide = await requestRide.execute(inputRequestRide);
  expect(resultOfRequestRide).toBeDefined();
  const inputGetRide = {
    rideId: resultOfRequestRide.rideId,
  };
  const resultOfGetRide = await getRide.execute(inputGetRide);
  expect(resultOfGetRide.status).toBe('requested');
  expect(resultOfGetRide.passengerName).toBe(inputSignup.name);
  expect(resultOfGetRide.passengerEmail).toBe(inputSignup.email);
  await connection.close();
});

test('Não deve poder solicitar uma nova corrida se não for um passageiro', async function () {
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const accountGateway = new AccountGatewayHttp();
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: '',
    isPassenger: false,
    isDriver: true,
  };
  const resultSignup = await accountGateway.signUp(inputSignup);
  const inputRequestRide = {
    passengerId: resultSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const requestRide = new RequestRide(accountRepository, rideRepository);
  expect(requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('Not is a passenger'));
  await connection.close();
});

test('Não deve poder solicitar uma nova corrida se o passageiro tiver outra corrida ativa', async function () {
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const accountGateway = new AccountGatewayHttp();
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: '',
    isPassenger: true,
    isDriver: false,
  };
  const resultSignup = await accountGateway.signUp(inputSignup);
  const requestRide = new RequestRide(accountRepository, rideRepository);
  const inputRequestRide = {
    passengerId: resultSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  await requestRide.execute(inputRequestRide);
  await expect(requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('Passenger already has a active ride'));
  await connection.close();
});
