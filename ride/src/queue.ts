import amqp from 'amqplib';
import pgp from 'pg-promise';

async function main() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  // await channel.assertExchange('rideRequested', 'direct', {durable: true});
  await channel.assertQueue('rideRequested.buildGetRideProjection', { durable: true });
  await channel.bindQueue('rideRequested.buildGetRideProjection', 'rideRequested', '');
  channel.consume('rideRequested.buildGetRideProjection', async function (msg: any) {
    const input = JSON.parse(msg.content.toString());
    console.log('creating projection', input);
    const database = pgp()('cccat16-postgres://postgres:123456@localhost:5432');
    await database.query(
      'insert into cccat16.ride_projection (ride_id, passenger_id, status, passenger_name, passenger_email, driver_name, driver_email) values ($1, $2, $3, $4, $5, $6, $7)',
      [input.rideId, input.passengerId, input.status, input.passengerName, input.passengerEmail, '', ''],
    );
    channel.ack(msg);
  });
}
main();
