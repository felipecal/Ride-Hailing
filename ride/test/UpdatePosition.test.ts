import GetRide from '../src/application/usecase/GetRide';
import RequestRide from '../src/application/usecase/RequestRide';
import { MailerGatewayMemory } from '../src/infra/gateway/MailerGateway';
import { RideRepositoryDatabase } from '../src/infra/repository/RideRepository';
import { PgPromiseAdapter, UnitOfWork } from '../src/infra/database/DatabaseConnection';
import AcceptRide from '../src/application/usecase/AcceptRide';
import StartRide from '../src/application/usecase/StartRide';
import UpdatePosition from '../src/application/usecase/UpdatePosition';
import { PositionRepositoryDatabase } from '../src/infra/repository/PositionRepository';
import AccountGatewayHttp from '../src/infra/gateway/AccountGatewayHttp';
import { AxiosAdapter } from '../src/infra/http/HttpClient';

test('Deve atualizar a posição da corrida', async function () {
  const connection = new PgPromiseAdapter();
  // const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const positionRepository = new PositionRepositoryDatabase(connection);
  const accountGateway = new AccountGatewayHttp(new AxiosAdapter())
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
  const startRide = new StartRide(rideRepository);
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  };
  await startRide.execute(inputStartRide);
  const unitOfWork = new UnitOfWork();
  const rideRepositoryUoW = new RideRepositoryDatabase(unitOfWork);
  const positionRepositoryUoW = new PositionRepositoryDatabase(unitOfWork);
  const updatePosition = new UpdatePosition(rideRepositoryUoW, positionRepositoryUoW);
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
    date: new Date(),
  };
  await updatePosition.execute(inputUpdatePosition1);
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
    date: new Date(),
  };
  await updatePosition.execute(inputUpdatePosition2);
  const getRide = new GetRide(accountGateway, rideRepository, positionRepository);
  const inputGetRide = {
    rideId: outputRequestRide.rideId,
  };
  const outputGetRide = await getRide.execute(inputGetRide);
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
  expect(outputGetRide.distance).toBe(10);
  await connection.close();
  await unitOfWork.close();
});
