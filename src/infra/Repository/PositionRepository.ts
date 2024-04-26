import Position from '../../domain/entity/Position';
import DatabaseConnection from '../database/DatabaseConnection';

// Driven/Resource Port
export interface PositionRepository {
  savePosition(position: Position): Promise<void>;
}
// Driven/Resource Adapter
export class PositionRepositoryDatabase implements PositionRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async savePosition(position: Position) {
    await this.connection.query(
      'insert into cccat16.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)',
      [position.positionId, position.rideId, position.coord.getLat(), position.coord.getLong(), position.date],
    );
  }
}

// Driven/Resource Adapter
export class PositionRepositoryMemory implements PositionRepository {
  positions: Position[];

  constructor() {
    this.positions = [];
  }

  async savePosition(position: Position): Promise<void> {
    this.positions.push(position);
  }

}
