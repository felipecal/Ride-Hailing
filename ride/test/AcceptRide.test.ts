import GetRide from '../src/application/usecase/GetRide';
import RequestRide from '../src/application/usecase/RequestRide';
import { PgPromiseAdapter } from '../src/infra/database/DatabaseConnection';
import AcceptRide from '../src/application/usecase/AcceptRide';
import { RideRepositoryDatabase } from '../src/infra/repository/RideRepository';
import { PositionRepositoryDatabase } from '../src/infra/repository/PositionRepository';
import { AxiosAdapter } from '../src/infra/http/HttpClient';
import { AccountGatewayHttp } from '../src/infra/gateway/AccountGatewayHttp';

test('Deve aceitar uma corrida', async function () {
  const connection = new PgPromiseAdapter();
  const rideRepository = new RideRepositoryDatabase(connection);
  const positionRepository = new PositionRepositoryDatabase(connection);
  const accountGateway = new AccountGatewayHttp(new AxiosAdapter());
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: '',
    isPassenger: true,
    isDriver: false,
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: 'AAA9999',
    isPassenger: false,
    isDriver: true,
  };
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
  const requestRide = new RequestRide(accountGateway, rideRepository);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const acceptRide = new AcceptRide(accountGateway, rideRepository);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide);
  const getRide = new GetRide(accountGateway, rideRepository, positionRepository);
  const inputGetRide = {
    rideId: outputRequestRide.rideId,
  };
  const outputGetRide = await getRide.execute(inputGetRide);
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('accepted');
  expect(outputGetRide.driverName).toBe('John Doe');
  await connection.close();
});
