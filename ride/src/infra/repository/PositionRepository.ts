import Position from '../../domain/entity/Position';
import DatabaseConnection from '../database/DatabaseConnection';

// Driven/Resource Port
export interface PositionRepository {
  savePosition(position: Position): Promise<void>;
  listPositionByRideId(rideId: string): Promise<Position[]>;
}
// Driven/Resource Adapter
export class PositionRepositoryDatabase implements PositionRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async savePosition(position: Position) {
    await this.connection.query('insert into cccat16.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)', [
      position.positionId,
      position.rideId,
      position.coord.getLat(),
      position.coord.getLong(),
      position.date,
    ]);
  }

  async listPositionByRideId(rideId: string): Promise<Position[]> {
		const positionsData = await this.connection.query("select * from cccat16.position where ride_id = $1", [rideId]);
		const positions = [];
		for (const positionData of positionsData) {
			positions.push(Position.restore(positionData.position_id, positionData.ride_id, parseFloat(positionData.lat), parseFloat(positionData.long), positionData.date));
		}
		return positions;
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

  
  listPositionByRideId(rideId: string): Promise<Position[]> {
    throw new Error('Method not implemented.');
  }
}
