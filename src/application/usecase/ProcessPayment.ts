
export default class ProcessPayment {
  constructor(){}

  async execute(rideId: string, creditCardToken: any, amount: number): Promise<void>{
    console.log('Ride id', rideId, 'creditCardToken', creditCardToken, 'amount', amount);

  }
}