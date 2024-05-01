import { AccountRepository } from '../../infra/repository/AccountRepository';
import { PositionRepository } from '../../infra/repository/PositionRepository';
import { RideRepository } from '../../infra/repository/RideRepository';

export default class GetRide {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository
  ) {}
  async execute(input: Input): Promise<Output> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    const passenger = await this.accountRepository.getById(ride.passengerId);
    let driver;
    if (ride.driverId) {
      driver = await this.accountRepository.getById(ride.driverId);
    }
    const positions = await this.positionRepository.listPositionByRideId(input.rideId)
    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      fromLat: ride.getFromLat(),
      fromLong: ride.getFromLong(),
      toLat: ride.getToLat(),
      toLong: ride.getToLong(),
      status: ride.getStatus(),
      passengerName: passenger.getName(),
      passengerEmail: passenger.getEmail(),
      driverName: driver?.getName(),
      driverEmail: driver?.getEmail(),
      distance: ride.distance,
      fare: ride.fare
    };
  }
}

//DTO - Data Transfer Object

type Input = {
  rideId: string;
};

//DTO - Data Transfer Object
type Output = {
  rideId: string;
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  passengerName: string;
  passengerEmail: string;
  driverName?: string;
  driverEmail?: string;
  distance: number;
  fare: number;
};
