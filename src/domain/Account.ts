import crypto from 'crypto';
import Name from './Name';
import Email from './Email';
import Cpf from './Cpf';
import CarPlate from './CarPlate';

export default class Account {
  private constructor(
    readonly accountId: string,
    private name: Name,
    private email: Email,
    private cpf: Cpf,
    private carPlate: CarPlate,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
  ) {
  }

  static create(name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean) {
    const accountId = crypto.randomUUID();
    return new Account(accountId, new Name(name), new Email(email), new Cpf(cpf), new CarPlate(carPlate), isPassenger, isDriver);
  }

  static restore(accountId: string, name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean) {
    return new Account(accountId, new Name(name), new Email(email), new Cpf(cpf), new CarPlate(carPlate), isPassenger, isDriver);
  }

  setName(name: string) {
    this.name = new Name(name)
  }

  getName() {
    return this.name.getValue()
  }
  getEmail() {
    return this.email.getValue()
  }
  getCpf() {
    return this.cpf.getValue()
  }
  getCarPlate() {
    return this.carPlate.getValue()
  }
}
