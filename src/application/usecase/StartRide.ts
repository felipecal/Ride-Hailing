import { RideRepository } from '../../infra/repository/RideRepository';

export default class StartRide {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.start();
    await this.rideRepository.updateRide(ride);
  }
}

//DTO = Data Transfer Object
type Input = {
  rideId: string;
};
