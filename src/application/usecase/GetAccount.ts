import { AccountRepository } from '../../infra/repository/AccountRepository';

export default class GetAccount {
  constructor(readonly accountDAO: AccountRepository) {}

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountDAO.getById(accountId);
    if (!account) throw new Error(`Account not found`);
    return {
      accountId: account.accountId,
      name: account.getName(),
      email: account.getEmail(),
      cpf: account.getCpf(),
      carPlate: account.getCarPlate(),
      isPassenger: account.isPassenger,
      isDriver: account.isDriver
    };
  }
}

type Output = {
  accountId: string;
  name: string;
  email:string;
  cpf: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
}
