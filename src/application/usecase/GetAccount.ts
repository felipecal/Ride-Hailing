import { AccountRepository } from "../../infra/Repository/AccountRepository";

export default class GetAccount {
  constructor(readonly accountDAO: AccountRepository) {}

  async execute(accountId: string) {
    const account = await this.accountDAO.getById(accountId);
    if (!account) throw new Error(`Account not found`);
    return account;
  }
}
