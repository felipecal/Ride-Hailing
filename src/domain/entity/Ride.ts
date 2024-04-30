import crypto from 'crypto';
import Segment from '../vo/Segment';
import Coord from '../vo/Coord';
import RideStatus, { RideStatusFactory } from '../vo/RideStatus';
import CalculateFare from '../ds/CalculateFare';

export default class Ride {
  status: RideStatus;

  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    public driverId: string,
    private segment: Segment,
    status: string,
    readonly date: Date,
  ) {
    this.status = RideStatusFactory.create(this, status);
  }

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const rideId = crypto.randomUUID();
    const status = 'requested';
    const date = new Date();
    return new Ride(rideId, passengerId, '', new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)), status, date);
  }

  static restore(
    rideId: string,
    passengerId: string,
    driverId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    date: Date,
  ) {
    return new Ride(rideId, passengerId, driverId, new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)), status, date);
  }

  accept(driverId: string) {
    this.status.accept();
    this.driverId = driverId;
  }

  start() {
    this.status.start();
  }

  finish() {
    this.status.finish();
    CalculateFare.calculate(this.getDistance());
  }

  getFromLat() {
    return this.segment.from.getLat();
  }

  getFromLong() {
    return this.segment.from.getLong();
  }

  getToLat() {
    return this.segment.to.getLat();
  }

  getToLong() {
    return this.segment.to.getLong();
  }

  getDistance() {
    return this.segment.getDistance();
  }

  getStatus() {
    return this.status.value;
  }
}
