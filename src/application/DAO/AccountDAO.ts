export default interface AccountDAO {
  getByEmail(email: string): Promise<any>
  getById(accountId: string): Promise<any>
  save(account: any): Promise<void>
}