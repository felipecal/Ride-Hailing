import pgp from "pg-promise";
import crypto from "crypto";
import { validateCpf } from "../validateCpf";
import AccountDAO from "../DAO/AccountDAO";


export default class Signup {

  constructor(readonly accountDAO: AccountDAO) { }

  async execute(input: Input) {
    input.accountId = crypto.randomUUID();
    const account = await this.accountDAO.getByEmail(input.email)
    if (account) throw new Error(`Account already exists`)
    if (!this.validateName(input.name)) throw new Error(`Invalid name`)
    if (!this.validateEmail(input.email)) throw new Error(`Invalid email`)
    if (!validateCpf(input.cpf)) throw new Error(`Invalid cpf`)
    if (input.isDriver && !this.validateCarPlate(input.carPlate)) throw new Error(`Invalid car plate`)
    await this.accountDAO.saveAccount(input)
    return {
      accountId: input.accountId
    };
  }

  private validateName(name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/)
  }

  private validateEmail(email: string) {
    return email.match(/^(.+)@(.+)$/)
  }

  private validateCarPlate(carPlate: string | undefined) {
    if (carPlate) return carPlate.match(/[A-Z]{3}[0-9]{4}/)
  }
}

type Input = {
  accountId?: string;
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger?: boolean;
  isDriver?: boolean;
}