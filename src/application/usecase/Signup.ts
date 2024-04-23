import { MailerGateway } from '../../infra/gateway/MailerGateway';
import Account from '../../domain/Account';
import { AccountRepository } from '../../infra/repository/AccountRepository';

export default class Signup {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly mailerGateway: MailerGateway,
  ) {}

	async execute (input: any): Promise<any> {
		const existingAccount = await this.accountRepository.getByEmail(input.email);
		if (existingAccount) throw new Error("Account already exists");
		const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.isPassenger, input.isDriver);
		await this.accountRepository.saveAccount(account);
		await this.mailerGateway.send(account.getEmail(), "Welcome!", "");
		return {
			accountId: account.accountId
		};
	}
}

type Input = {
  accountId?: string;
  name: string;
  email: string;
  cpf: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
};
