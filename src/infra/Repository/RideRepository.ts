import Ride from '../../domain/entity/Ride';
import DatabaseConnection from '../database/DatabaseConnection';

export interface RideRepository {
  getRideById(rideId: string): Promise<Ride>;
  getActivesRidesByPassengerID(passengerId: string): Promise<Ride | undefined>;
  saveRide(ride: Ride): Promise<void>;
  updateRide (ride: Ride): Promise<void>;}

// Driven/Port
export class RideRepositoryDatabase implements RideRepository {
  constructor(readonly connection: DatabaseConnection) {}
  // Driven/Adapter
  async getRideById(rideId: string) {
    const [ride] = await this.connection.query('select * from cccat16.ride where ride_id = $1', [rideId]);
    return Ride.restore(ride.ride_id, ride.passenger_id, ride.driver_id, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.status, ride.date);
  }

  async getActivesRidesByPassengerID(passengerId: string) {
    const [ride] = await this.connection.query(
      "select * from cccat16.ride where passenger_id = $1 and status = 'requested' and status <> 'completed'",
      [passengerId],
    );
    if (!ride) return;
    return Ride.restore(ride.ride_id, ride.passenger_id, ride.driver_id, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.status, ride.date);
  }

  async saveRide(ride: Ride) {
    await this.connection.query(
      'insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)',
      [ride.rideId, ride.passengerId, ride.getFromLat(), ride.getFromLong(), ride.getToLat(), ride.getToLong(), ride.getStatus(), ride.date],
    );
  }

	async updateRide(ride: Ride): Promise<void> {
		await this.connection.query("update cccat16.ride set status = $1, driver_id = $2 where ride_id = $3", [ride.getStatus(), ride.driverId, ride.rideId]);
	}
  
}

// Driven/Adapter
export class RideRepositoryMemory implements RideRepository {
  rides: Ride[];

  constructor() {
    this.rides = [];
  }

  async getRideById(rideId: string): Promise<any> {
    const ride = this.rides.find((ride: Ride) => ride.rideId === rideId);
    return ride;
  }
  async getActivesRidesByPassengerID(passengerId: string): Promise<any> {
    const ride = this.rides.find((ride: Ride) => ride.passengerId === passengerId);
    return ride;
  }
  async saveRide(ride: Ride): Promise<void> {
    this.rides.push(ride);
  }

  async updateRide(ride: Ride): Promise<void> {
    this.rides.forEach((element: any, index: any) => { 
      if(element.driverId === ride.driverId) [
        element[index] = ride
      ]
    })
  }
}
