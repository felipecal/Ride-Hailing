//main

import ProcessPayment from './application/usecase/ProcessPayment';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import { ExpressAdapter, HapiAdapter } from './infra/http/HttpServer';
import PaymentController from './infra/http/PaymentController';
import ORM from './infra/orm/ORM';
import { RabbitMQAdapter } from './infra/queue/Queue';
import QueueController from './infra/queue/QueueController';
import TransactionRepositoryORM from './infra/repository/TransactionRepositoryORM';

async function main() {
  const httpServer = new ExpressAdapter();
  const connection = new PgPromiseAdapter()
  const orm = new ORM(connection);
	const transactionRepository = new TransactionRepositoryORM(orm);
  const processPayment = new ProcessPayment(transactionRepository);
  new PaymentController(httpServer, processPayment);
  const queue = new RabbitMQAdapter();
  await queue.connect();
  new QueueController(queue, processPayment);
  httpServer.listen(3001);
}

main();
