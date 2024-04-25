import { AccountRepository } from '../../infra/repository/AccountRepository';
import { RideRepository } from '../../infra/repository/RideRepository';
import Ride from '../../domain/entity/Ride';

export default class RequestRide {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const resultOfGetAccount = await this.accountRepository.getById(input.passengerId);
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
  rideId?: string;
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status?: string;
  date?: Date;
};

type Output = {
  rideId: string;
};
