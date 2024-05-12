export default interface AccountGateway {
  getAccountById(accountId: string): Promise<OutputGetAccount>;
  signup(input: InputSignUp): Promise<OutputSignUp>;
}

type OutputGetAccount = {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
};

type InputSignUp = {
  name: string;
  email: string;
  cpf: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
};

export type OutputSignUp = {
  accountId: string;
};
