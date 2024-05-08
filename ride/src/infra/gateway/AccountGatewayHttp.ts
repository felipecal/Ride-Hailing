import AccountGateway from '../../application/gateway/AccountGateway';
import HttpClient from '../http/HttpClient';

export default class AccountGatewayHttp implements AccountGateway {
  constructor(readonly httpClient: HttpClient) {}
  async getAccount(accountId: string): Promise<{ accountId: string; name: string; email: string; cpf: string; carPlate: string; isPassenger: boolean; isDriver: boolean }> {
    const account = await this.httpClient.get(`http://localhost:3000/getAccountById/${accountId}`);
    return account;
  }
  async signUp(input: { name: string; email: string; cpf: string; carPlate: string; isPassenger: boolean; isDriver: boolean }): Promise<{ accountId: string }> {
    const signup = await this.httpClient.post('http://localhost:3000/signup', input);
    return signup;
  }
}
