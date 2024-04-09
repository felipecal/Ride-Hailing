export default interface AccountDAO {
  getByEmail(email: string): Promise<any>;
  getById(accountId: string): Promise<any>;
  saveAccount(account: any): Promise<void>;
}
