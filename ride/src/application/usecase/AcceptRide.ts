// import { AccountRepository } from '../../infra/repository/AccountRepository';
import { RideRepository } from '../../infra/repository/RideRepository';
import AccountGateway from '../gateway/AccountGateway';

export default class AcceptRide {
  constructor(
    readonly accountGateway: AccountGateway,
    readonly rideRepository: RideRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const account = await this.accountGateway.getAccountById(input.driverId);
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
