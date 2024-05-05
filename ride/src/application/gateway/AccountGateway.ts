export default interface AccountGateway {
  getAccount(accountId: string): Promise<OutputGetAccount>;
  signUp(input: InputSignUp): Promise<OutputSignUp>
}

type InputGetAccount = {
  accountId: string
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

type OutputSignUp = {
  accountId: string;
};
