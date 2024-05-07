import { RideRepository } from '../../infra/repository/RideRepository';
import Ride from '../../domain/entity/Ride';
import AccountGateway from '../gateway/AccountGateway';

export default class RequestRide {
  constructor(
    readonly accountGateway: AccountGateway,
    readonly rideRepository: RideRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const resultOfGetAccount = await this.accountGateway.getAccount(input.passengerId);
    if (!resultOfGetAccount) throw new Error('Account not exists');
    if (!resultOfGetAccount.isPassenger) throw new Error('Not is a passenger');
    const activeRide = await this.rideRepository.getActivesRidesByPassengerID(input.passengerId);
    if (activeRide) throw new Error('Passenger already has a active ride');
    const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
    await this.rideRepository.saveRide(ride);
    return {
      rideId: ride.rideId,
    };
  }
}

type Input = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
};

type Output = {
  rideId: string;
};
