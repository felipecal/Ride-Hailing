import axios from 'axios';
import AccountGateway from '../../application/gateway/AccountGateway';

export default class AccountGatewayHttp implements AccountGateway {
  async getAccount(input: { accountId: string }): Promise<{ accountId: string; name: string; email: string; cpf: string; carPlate: string; isPassenger: boolean; isDriver: boolean; }> {
    const account = await axios.post('http://localhost:3000/signup', input);
    return account.data;
  }
  async signUp(input: { name: string; email: string; cpf: string; carPlate: string; isPassenger: boolean; isDriver: boolean; }): Promise<{ accountId: string; }> {
    const signup = await axios.post('http://localhost:3000/signup', input);
    return signup.data
  }
}
