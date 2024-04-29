import CalculateFare from '../../domain/ds/CalculateFare';
import DistanceCalculator from '../../domain/ds/DistanceCalculator';
import Position from '../../domain/entity/Position';
import { RideRepository } from '../../infra/repository/RideRepository';
import ProcessPayment from './ProcessPayment';

export default class FinishRide {
  constructor(readonly rideRepository: RideRepository,private processPayment: ProcessPayment) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    if(!ride) throw new Error('Ride not found ')
      ride.finish();
      await this.rideRepository.updateRide(ride);
      // this.processPayment.execute(ride.rideId, 'tokenExample', ride.amount)
  }
}

//DTO = Data Transfer Object
type Input = {
  rideId: string;
};
