import AccountDAO from "../DAO/AccountDAO";

export default class GetAccount {
  constructor(readonly accountDAO: AccountDAO) {
  }

  async execute(accountId: string) {
    const account = await this.accountDAO.getById(accountId)
    if (!account) throw new Error(`Account not found`)
    return account;
  }
}