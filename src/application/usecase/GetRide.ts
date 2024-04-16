import { AccountDAO } from '../../infra/DAODatabase/AccountDAODatabase';
import { RideDAO } from '../../infra/DAODatabase/RideDAODatabase';

export default class GetRide {
  constructor(
    readonly accountDAO: AccountDAO,
    readonly rideDAO: RideDAO,
  ) {}

  async execute(rideId: string): Promise<Output> {
    const resultOfGetRide = await this.rideDAO.getRideById(rideId);
    if (!resultOfGetRide) throw new Error('Ride not found');
    const resultOfGetPassenger = await this.accountDAO.getById(resultOfGetRide.passenger_id);
    if (!resultOfGetPassenger) throw new Error('Passenger not found');
    return {
      // TODO: change snake case to camel case after implement domain
      passengerId: resultOfGetRide.passenger_id,
      rideId: resultOfGetRide.ride_id,
      fromLat: parseInt(resultOfGetRide.from_lat),
      fromLong: parseInt(resultOfGetRide.from_long),
      toLat: parseInt(resultOfGetRide.to_lat),
      toLong: parseInt(resultOfGetRide.to_long),
      status: resultOfGetRide.status,
      date: resultOfGetRide.date,
      passengerName: resultOfGetPassenger.name,
      passengerEmail: resultOfGetPassenger.email
    };
  }
}

type Output = {
  passengerId: string;
  rideId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  date: Date;
  passengerName: string;
  passengerEmail: string
};
