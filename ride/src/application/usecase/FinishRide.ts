import { inject } from '../../infra/di/Registry';
import { RideRepository } from '../../infra/repository/RideRepository';
import PaymentGateway from '../gateway/PaymentGateway';

export default class FinishRide {
	@inject("rideRepository")
	readonly rideRepository!: RideRepository;
	@inject("paymentGateway")
	readonly paymentGateway!: PaymentGateway;

  constructor(
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    if (!ride) throw new Error('Ride not found ');
    ride.finish();
    await this.rideRepository.updateRide(ride);
    await this.paymentGateway.processPayment({rideId: ride.rideId, amount: ride.fare})
  }
}

//DTO = Data Transfer Object
type Input = {
  rideId: string;
};
