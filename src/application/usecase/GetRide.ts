import { AccountRepository } from "../../infra/repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";

export default class GetRide {
  constructor(
    readonly accountDAO: AccountRepository,
    readonly rideDAO: RideRepository,
  ) {}

  async execute(rideId: string): Promise<Output> {
    const resultOfGetRide = await this.rideDAO.getRideById(rideId);
    if (!resultOfGetRide) throw new Error('Ride not found');
    const resultOfGetPassenger = await this.accountDAO.getById(resultOfGetRide.passengerId);
    if (!resultOfGetPassenger) throw new Error('Passenger not found');
    return {
      passengerId: resultOfGetRide.passengerId,
      rideId: resultOfGetRide.rideId,
      fromLat: resultOfGetRide.fromLat,
      fromLong: resultOfGetRide.fromLong,
      toLat: resultOfGetRide.toLat,
      toLong: resultOfGetRide.toLong,
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
