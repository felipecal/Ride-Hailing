import { RideRepository } from './../../infra/repository/RideRepository';
import { PositionRepository } from './../../infra/repository/PositionRepository';
import Position from '../../domain/entity/Position';

export default class UpdatePosition {
  constructor(private rideRepository: RideRepository, private positionRepository: PositionRepository) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getRideById(input.rideId)
    ride.updatePosition(input.lat, input.long, input.date);
    await this.rideRepository.updateRide(ride);
    const position = Position.create(input.rideId, input.lat, input.long, input.date);
    await this.positionRepository.savePosition(position);
    await this.rideRepository.connection.commit()
  }
}

//DTO = Data Transfer Object
type Input = {
  rideId: string;
  lat: number;
  long: number;
  date: Date
};
