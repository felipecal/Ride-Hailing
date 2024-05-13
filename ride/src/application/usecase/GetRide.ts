import { PositionRepository } from '../../infra/repository/PositionRepository';
import { RideRepository } from '../../infra/repository/RideRepository';
import AccountGateway from '../gateway/AccountGateway';

export default class GetRide {
  constructor(
    readonly accountGateway: AccountGateway,
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    const passenger = await this.accountGateway.getAccountById(ride.passengerId);
    let driver;
    if (ride.driverId) {
      driver = await this.accountGateway.getAccountById(ride.driverId);
    }
    const positions = await this.positionRepository.listPositionByRideId(input.rideId);
    return {
      passengerId: ride.passengerId,
      passengerName: passenger.name,
      passengerEmail: passenger.email,
      passengerCpf: passenger.cpf,
      driverName: driver?.name,
      driverEmail: driver?.email,
      driverCpf: driver?.cpf,
      driverCarPlate: driver?.carPlate,
      rideId: ride.rideId,
      fromLat: ride.getFromLat(),
      fromLong: ride.getFromLong(),
      toLat: ride.getToLat(),
      toLong: ride.getToLong(),
      status: ride.getStatus(),
      distance: ride.distance,
      fare: ride.fare,
    };
  }
}

//DTO - Data Transfer Object

type Input = {
  rideId: string;
};

//DTO - Data Transfer Object
type Output = {
  passengerId: string;
  passengerName: string;
  passengerEmail: string;
  passengerCpf: string;
  driverName?: string;
  driverEmail?: string;
  driverCpf?: string;
  driverCarPlate?: string;
  rideId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  distance: number;
  fare: number;
};
