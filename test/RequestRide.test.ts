import GetRide from "../src/application/usecase/GetRide"
import RequestRide from "../src/application/usecase/RequestRide"
import Signup from "../src/application/usecase/Signup";
import { AccountDAODatabase } from "../src/infra/DAODatabase/AccountDAODatabase";
import { RideDAODatabase } from "../src/infra/DAODatabase/RideDAODatabase";
import { MailerGatewayMemory } from "../src/infra/Gateway/MailerGateway";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
  const accountDAO = new AccountDAODatabase();
  const rideDAO = new RideDAODatabase();
  const mailerGateway = new MailerGatewayMemory()
  requestRide = new RequestRide(accountDAO, rideDAO);
  getRide = new GetRide(accountDAO, rideDAO);
  signup = new Signup(accountDAO, mailerGateway)
})

test('Deve solicitar uma nova corrida', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  const resultSignup = await signup.execute(inputSignup)
  const inputRequestRide = {
    passengerId: resultSignup.accountId,
    fromLat: 1,
    fromLong: 1,
    toLat: 2,
    toLong: 2
  }
  const resultOfRequestRide = await requestRide.execute(inputRequestRide);
  expect(resultOfRequestRide).toBeDefined();
  const resultOfGetRide = await getRide.execute(resultOfRequestRide.rideId);
  expect(resultOfGetRide.status).toBe("requested");
  expect(resultOfGetRide.passengerName).toBe(inputSignup.name);
  expect(resultOfGetRide.passengerEmail).toBe(inputSignup.email);
})

test('Não deve poder solicitar uma nova corrida se não for um passageiro', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: false,
  };
  const resultSignup = await signup.execute(inputSignup)
  const inputRequestRide = {
    passengerId: resultSignup.accountId,
    fromLat: 1,
    fromLong: 1,
    toLat: 2,
    toLong: 2
  }
  expect( requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('Not is a passenger'))
})

test('Não deve poder solicitar uma nova corrida se o passageiro tiver outra corrida ativa', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  const resultSignup = await signup.execute(inputSignup)
  const inputRequestRide = {
    passengerId: resultSignup.accountId,
    fromLat: 1,
    fromLong: 1,
    toLat: 2,
    toLong: 2
  }
  await requestRide.execute(inputRequestRide);
  await expect(requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('Passenger already has a active ride'))
})