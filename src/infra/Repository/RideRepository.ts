import Ride from '../../domain/entity/Ride';
import DatabaseConnection from '../database/DatabaseConnection';
export interface RideRepository {
  getRideById(rideId: string): Promise<Ride>;
  getActivesRidesByPassengerID(email: string): Promise<Ride | undefined>;
  saveRide(ride: Ride): Promise<void>;
}

// Driven/Port
export class RideRepositoryDatabase implements RideRepository {
  constructor(readonly connection: DatabaseConnection) {}
  // Driven/Adapter
  async getRideById(rideId: string) {
    const [ride] = await this.connection.query('select * from cccat16.ride where ride_id = $1', [rideId]);
    return Ride.restore(ride.ride_id, ride.passenger_id, ride.from_late, ride.from_long, ride.to_lat, ride.to_long, ride.status, ride.date);
  }

  async getActivesRidesByPassengerID(passengerId: string) {
    const [ride] = await this.connection.query(
      "select * from cccat16.ride where passenger_id = $1 and status = 'requested' and status <> 'completed'",
      [passengerId],
    );
    if (!ride) return;
    return Ride.restore(ride.ride_id, ride.passenger_id, ride.from_late, ride.from_long, ride.to_lat, ride.to_long, ride.status, ride.date);
  }

  async saveRide(ride: Ride) {
    await this.connection.query(
      'insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)',
      [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.status, ride.date],
    );
  }
}

// Driven/Adapter
export class AcountRepositoryMemory implements RideRepository {
  rides: any[];

  constructor() {
    this.rides = [];
  }
  async getRideById(rideId: string): Promise<any> {
    const ride = this.rides.find((ride: any) => ride.rideId === rideId);
    return ride;
  }
  async getActivesRidesByPassengerID(email: string): Promise<any> {
    const ride = this.rides.find((ride: any) => ride.email === email);
    return ride;
  }
  async saveRide(ride: any): Promise<void> {
    this.rides.push(ride);
  }
}
