import { AccountDAO } from "../../infra/DAODatabase/AccountDAODatabase";
import { RideDAODatabase } from "../../infra/DAODatabase/RideDAODatabase";
import crypto from "crypto";

export default class RequestRide {
  constructor(readonly accountDAO: AccountDAO, readonly rideDAO: RideDAODatabase){
  }

  async execute (input: Input): Promise<Output>{
    const resultOfGetAccount = await this.accountDAO.getById(input.passengerId);
    if(!resultOfGetAccount) throw new Error('Account not exists')
    if(!resultOfGetAccount.is_passenger) throw new Error('Not is a passenger');
    input.rideId = crypto.randomUUID();
    input.status = 'requested';
    input.date = new Date();
    const [activeRide] = await this.rideDAO.getActivesRidesByPassengerID(input.passengerId);
    if (activeRide) throw new Error('Passenger already has a active ride')
    this.rideDAO.saveRide(input);
  return {
    rideId: input.rideId
  }
  }
}

type Input = {
  rideId?: string,
	passengerId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number
  status?: string,
  date?: Date,
}

type Output = {
  rideId: string;
}