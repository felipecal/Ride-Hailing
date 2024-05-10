import DomainEvent from '../../domain/event/DomainEvent';
import { inject } from '../../infra/di/Registry';
import Mediator from '../../infra/mediator/Mediator';
import Queue from '../../infra/queue/Queue';
import { RideRepository } from '../../infra/repository/RideRepository';
import PaymentGateway from '../gateway/PaymentGateway';

export default class FinishRide {
  @inject('rideRepository')
  readonly rideRepository!: RideRepository;
  @inject('paymentGateway')
  readonly paymentGateway!: PaymentGateway;
  @inject('mediator')
  readonly mediator!: Mediator;
@inject('queue')
  readonly queue!: Queue;

  constructor() {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.register('rideCompleted', async (domainEvent: DomainEvent) => {
      this.queue.publish(domainEvent.eventName, domainEvent.data);
    });
    if (!ride) throw new Error('Ride not found ');
    ride.finish();
    await this.rideRepository.updateRide(ride);
    // await this.paymentGateway.processPayment({ rideId: ride.rideId, amount: ride.fare });
  }
}

//DTO = Data Transfer Object
type Input = {
  rideId: string;
};
