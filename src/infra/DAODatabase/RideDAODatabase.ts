import pgp from 'pg-promise';
export interface RideDAO {
  getRideById(rideId: string): Promise<any>;
  getActivesRidesByPassengerID(email: string): Promise<any>;
  saveRide(account: any): Promise<void>;
}

// Driven/Port
export class RideDAODatabase implements RideDAO {
  // Driven/Adapter
  async getRideById(rideId: string) {
    const connection = pgp()('cccat16-postgres://postgres:123456@localhost:5432');
    const [account] = await connection.query('select * from cccat16.ride where ride_id = $1', [rideId]);
    await connection.$pool.end();
    return account;
  }

  async getActivesRidesByPassengerID(passengerId: string) {
    const connection = pgp()('cccat16-postgres://postgres:123456@localhost:5432');
    const [account] = await connection.query("select * from cccat16.ride where passenger_id = $1 and status = 'requested' and status <> 'completed'", [passengerId]);
    await connection.$pool.end();
    return [account];
  }

  async saveRide(ride: any) {
    const connection = pgp()('cccat16-postgres://postgres:123456@localhost:5432');
    await connection.query(
      'insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)',
      [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.status, ride.date],
    );
    await connection.$pool.end();
  }
}

// Driven/Adapter
export class AcountDAOMemory implements RideDAO {
  rides: any[];

  constructor() {
    this.rides = [];
  }
  async getRideById(rideId: string): Promise<any> {
    const account = this.rides.find((account: any) => account.rideId === rideId);
    return account;
  }
  async getActivesRidesByPassengerID(email: string): Promise<any> {
    const account = this.rides.find((account: any) => account.email === email);
    return account;
  }
  async saveRide(account: any): Promise<void> {
    this.rides.push(account);
  }
}
