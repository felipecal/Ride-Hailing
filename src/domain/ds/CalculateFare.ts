export default class CalculateFare {
  static calculate(distance: number) {
    const distanceMultiplier = 2.1;
    return distance * distanceMultiplier;
  }
} 