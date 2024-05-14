import ProcessPayment from "../src/application/usecase/ProcessPayment";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import crypto from "crypto";
import TransactionRepositoryDatabase from "../src/infra/repository/TransactionRepositoryDatabase";
import GetTransaction from "../src/application/usecase/GetTransaction";


test("Deve criar uma transação", async function () {
	const connection = new PgPromiseAdapter();
	const transactionRepository = new TransactionRepositoryDatabase(connection);
	// const orm = new ORM(connection);
	// const transactionRepository = new TransactionRepositoryORM(connection);
	const processPayment = new ProcessPayment(transactionRepository);
	const inputProcessPayment = {
		rideId: crypto.randomUUID(),
		amount: 100
	};
	const outputProcessPayment = await processPayment.execute(inputProcessPayment);
	const getTransaction = new GetTransaction(transactionRepository);
	const outputGetTransaction = await getTransaction.execute(outputProcessPayment.transactionId);
	expect(outputGetTransaction.amount).toBe(100);
	expect(outputGetTransaction.status).toBe("pending");
	await connection.close();
});