import pgp from "pg-promise";
import AccountDAO from "../../application/DAO/AccountDAO";


export default class AccountDAODatabase implements AccountDAO{

  async getByEmail(email: string) {
    const connection = pgp()("cccat16-postgres://postgres:123456@localhost:5432");
    const [account] = await connection.query("select * from cccat16.account where email = $1", [email]);
    await connection.$pool.end()
    return account
  }

  async getById(accountId: string) {
    const connection = pgp()("cccat16-postgres://postgres:123456@localhost:5432");
    const [account] = await connection.query("select * from cccat16.account where account_id = $1", [accountId]);
    await connection.$pool.end();
    return account;
  }

  async saveAccount(account: any) {
    const connection = pgp()("cccat16-postgres://postgres:123456@localhost:5432");
    await connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver]);
    await connection.$pool.end();
  }

}