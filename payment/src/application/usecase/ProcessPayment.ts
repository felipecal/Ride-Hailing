export default class ProcessPayment {
  constructor() {}

  async execute(input: Input): Promise<void> {
    console.log('Ride id', input.rideId, 'amount', input.amount);
  }
}


type Input = {
	rideId: string,
	amount: number
}