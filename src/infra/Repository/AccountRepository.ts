import Account from '../../domain/entity/Account';
import DatabaseConnection from '../database/DatabaseConnection';

// Driven/Resource Port
export interface AccountRepository {
  getByEmail(email: string): Promise<Account | undefined>;
  getById(accountId: string): Promise<Account>;
  saveAccount(account: Account): Promise<void>;
}

// Driven/Resource Adapter
export class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly connection: DatabaseConnection) {}
  async getByEmail(email: string) {
    const [account] = await this.connection.query('select * from cccat16.account where email = $1', [email]);
    if (!account) return;
    return Account.restore(account.account_id, account.name, account.email, account.cpf, account.car_plate, account.is_passenger, account.is_driver);
  }

  // Driven/Adapter
  async getById(accountId: string) {
    const [account] = await this.connection.query('select * from cccat16.account where account_id = $1', [accountId]);
    return Account.restore(account.account_id, account.name, account.email, account.cpf, account.car_plate, account.is_passenger, account.is_driver);
  }

  async saveAccount(account: Account) {
    await this.connection.query(
      'insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)',
      [account.accountId, account.getName(), account.getEmail(), account.getCpf(), account.getCarPlate(), !!account.isPassenger, !!account.isDriver],
    );
  }
}

// Driven/Resource Adapter
export class AcountRepositoryMemory implements AccountRepository {
  accounts: Account[];

  constructor() {
    this.accounts = [];
  }
  async getByEmail(email: string): Promise<any> {
    const account = this.accounts.find((account: Account) => account.getEmail() === email);
    return account;
  }
  async getById(accountId: string): Promise<any> {
    const account = this.accounts.find((account: Account) => account.accountId === accountId);
    return account;
  }
  async saveAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }
}
