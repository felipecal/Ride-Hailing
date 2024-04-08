import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test("Deve criar uma conta para o passageiro e consultar conta", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const resultSignUp = await axios.post("http://localhost:3000/signup", input);
	const resultOfGetUser = await axios.get(`http://localhost:3000/getAccountById/${resultSignUp.data.accountId}`);
	expect(resultSignUp.data.accountId).toBe(resultOfGetUser.data.account_id);
	expect(input.name).toBe(resultOfGetUser.data.name)
	expect(input.email).toBe(resultOfGetUser.data.email)
	expect(input.cpf).toBe(resultOfGetUser.data.cpf)
});

test("Deve criar uma conta para o motorista e consultar conta", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
		isDriver: true,
		carPlate: 'AAA1111'
	};
	const resultSignUp = await axios.post("http://localhost:3000/signup", input);
	const resultOfGetUser = await axios.get(`http://localhost:3000/getAccountById/${resultSignUp.data.accountId}`);
	expect(resultSignUp.data.accountId).toBe(resultOfGetUser.data.account_id);
	expect(input.name).toBe(resultOfGetUser.data.name)
	expect(input.email).toBe(resultOfGetUser.data.email)
	expect(input.cpf).toBe(resultOfGetUser.data.cpf)
});
