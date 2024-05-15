import TransactionRepository from "../../application/repository/TransactionRepository";
import Transaction from "../../domain/Transaction";
import ORM from "../orm/ORM";
import TransactionModel from "../orm/TransactionModel";

export default class TransactionRepositoryORM implements TransactionRepository {

	constructor (readonly orm: ORM) {
	}

	async save(transaction: Transaction): Promise<void> {
		await this.orm.save(TransactionModel.getModelFromAggregate(transaction));
	}
	
	async get(transactionId: string): Promise<Transaction> {
		const transactionModel = await this.orm.get("transaction_id", transactionId, TransactionModel);
		return transactionModel.getAggregate();
	}

}