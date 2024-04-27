import { AccountRepository } from '../../infra/repository/AccountRepository';
import { RideRepository } from '../../infra/repository/RideRepository';

export default class AcceptRide {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const account = await this.accountRepository.getById(input.driverId);
    if (!account.isDriver) throw new Error('Account is not from a driver');
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.accept(input.driverId);
    await this.rideRepository.updateRide(ride);
  }
}

//DTO = Data Transfer Object
type Input = {
  rideId: string;
  driverId: string;
};
