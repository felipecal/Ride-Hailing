import { PositionRepository } from './../../infra/repository/PositionRepository';
import Position from '../../domain/entity/Position';

export default class UpdatePosition {
  constructor(private positionRepository: PositionRepository) {}

  async execute(input: Input): Promise<void> {
    const position = Position.create(input.rideId, input.lat, input.long);
    this.positionRepository.savePosition(position);
  }
}

//DTO = Data Transfer Object
type Input = {
  rideId: string;
  lat: number;
  long: number;
};
