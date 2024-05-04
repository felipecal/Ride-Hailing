import Ride from '../../domain/entity/Ride';
import DatabaseConnection from '../database/DatabaseConnection';

// Driven/Resource Port
export interface RideRepository {
  connection: DatabaseConnection;
  getRideById(rideId: string): Promise<Ride>;
  getActivesRidesByPassengerID(passengerId: string): Promise<Ride | undefined>;
  saveRide(ride: Ride): Promise<void>;
  updateRide(ride: Ride): Promise<void>;
}

// Driven/Resource Adapter
export class RideRepositoryDatabase implements RideRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async getRideById(rideId: string) {
    const [ride] = await this.connection.query('select * from cccat16.ride where ride_id = $1', [rideId]);
    return Ride.restore(
      ride.ride_id,
      ride.passenger_id,
      ride.driver_id,
      parseFloat(ride.from_lat),
      parseFloat(ride.from_long),
      parseFloat(ride.to_lat),
      parseFloat(ride.to_long),
      ride.status,
      ride.date,
      parseFloat(ride.last_lat),
      parseFloat(ride.last_long),
      parseFloat(ride.distance),
      parseFloat(ride.fare),
    );
  }

  async getActivesRidesByPassengerID(passengerId: string) {
    const [ride] = await this.connection.query("select * from cccat16.ride where passenger_id = $1 and status = 'requested' and status <> 'completed'", [passengerId]);
    if (!ride) return;
    return Ride.restore(
      ride.ride_id,
      ride.passenger_id,
      ride.driver_id,
      parseFloat(ride.from_lat),
      parseFloat(ride.from_long),
      parseFloat(ride.to_lat),
      parseFloat(ride.to_long),
      ride.status,
      ride.date,
      parseFloat(ride.last_lat),
      parseFloat(ride.last_long),
      parseFloat(ride.distance),
      parseFloat(ride.fare),
    );
  }

  async saveRide(ride: Ride) {
    await this.connection.query(
      'insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date, last_lat, last_long, distance, fare) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      [
        ride.rideId,
        ride.passengerId,
        ride.getFromLat(),
        ride.getFromLong(),
        ride.getToLat(),
        ride.getToLong(),
        ride.getStatus(),
        ride.date,
        ride.lastPosition.getLat(),
        ride.lastPosition.getLong(),
        ride.distance,
        ride.fare,
      ],
    );
  }

  async updateRide(ride: Ride): Promise<void> {
    await this.connection.query(
      'update cccat16.ride set status = $1, driver_id = $2, last_lat = $3, last_long = $4, distance = $5, fare = $6 where ride_id = $7',
      [ride.getStatus(), ride.driverId, ride.lastPosition.getLat(), ride.lastPosition.getLong(), ride.distance, ride.fare, ride.rideId],
      true,
    );
  }
}

// Driven/Resource Adapter
// export class RideRepositoryMemory implements RideRepository {
//   rides: Ride[];

//   constructor() {
//     this.rides = [];
//   }
//   connection: DatabaseConnection;

//   async getRideById(rideId: string): Promise<any> {
//     const ride = this.rides.find((ride: Ride) => ride.rideId === rideId);
//     return ride;
//   }
//   async getActivesRidesByPassengerID(passengerId: string): Promise<any> {
//     const ride = this.rides.find((ride: Ride) => ride.passengerId === passengerId);
//     return ride;
//   }
//   async saveRide(ride: Ride): Promise<void> {
//     this.rides.push(ride);
//   }

//   async updateRide(ride: Ride): Promise<void> {
//     this.rides.forEach((element: any, index: any) => {
//       if (element.driverId === ride.driverId) [(element[index] = ride)];
//     });
//   }
// }
