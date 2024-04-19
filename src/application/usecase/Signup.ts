import { MailerGateway } from '../../infra/gateway/MailerGateway';
import Account from '../../domain/Account';
import { AccountRepository } from '../../infra/repository/AccountRepository';

export default class Signup {
  constructor(
    readonly accountDAO: AccountRepository,
    readonly mailerGateway: MailerGateway,
  ) {}

  async execute(input: any) {
    const resultIfExistsAccount = await this.accountDAO.getByEmail(input.email);
    if (resultIfExistsAccount) throw new Error(`Account already exists`);
    const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.isPassenger, input.isDriver);
    await this.accountDAO.saveAccount(account);
    await this.mailerGateway.send(input.email, 'Welcome', '');
    return {
      accountId: account.accountId,
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
