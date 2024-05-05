import GetRide from '../src/application/usecase/GetRide';
import RequestRide from '../src/application/usecase/RequestRide';
import { PgPromiseAdapter } from '../src/infra/database/DatabaseConnection';
import { MailerGatewayMemory } from '../src/infra/gateway/MailerGateway';
import { AccountRepositoryDatabase } from '../src/infra/repository/AccountRepository';
import AcceptRide from '../src/application/usecase/AcceptRide';
import { RideRepositoryDatabase } from '../src/infra/repository/RideRepository';
import { PositionRepositoryDatabase } from '../src/infra/repository/PositionRepository';
import AccountGatewayHttp from '../src/infra/gateway/AccountGateway';

test('Deve aceitar uma corrida', async function () {
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const positionRepository = new PositionRepositoryDatabase(connection);
  const accountGateway = new AccountGatewayHttp()
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: '',
    isPassenger: true,
    isDriver: false,
  };
  const outputSignup = await accountGateway.signUp(inputSignup);
  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: 'AAA9999',
    isPassenger: false,
    isDriver: true,
  };
  const outputSignupDriver = await accountGateway.signUp(inputSignupDriver);
  const requestRide = new RequestRide(accountRepository, rideRepository);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const acceptRide = new AcceptRide(accountRepository, rideRepository);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide);
  const getRide = new GetRide(accountRepository, rideRepository, positionRepository);
  const inputGetRide = {
    rideId: outputRequestRide.rideId,
  };
  const outputGetRide = await getRide.execute(inputGetRide);
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('accepted');
  expect(outputGetRide.driverName).toBe('John Doe');
  await connection.close();
});
