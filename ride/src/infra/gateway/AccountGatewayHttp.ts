import AccountGateway, { OutputSignUp } from '../../application/gateway/AccountGateway';
import HttpClient from '../http/HttpClient';

export class AccountGatewayHttp implements AccountGateway {
  constructor(readonly httpClient: HttpClient) {}

  async signup(input: any): Promise<OutputSignUp> {
    const response = await this.httpClient.post('http://localhost:3002/signup', input);
    return response;
  }

  async getAccountById(accountId: string): Promise<any> {
    const response = await this.httpClient.get(`http://localhost:3002/getAccountById/${accountId}`);
    return response;
  }
}
