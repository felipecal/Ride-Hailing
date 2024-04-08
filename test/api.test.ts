import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const resultSignUp = await axios.post("http://localhost:3000/signup", input);
	const resultOfGetUser = await axios.get(`http://localhost:3000/getAccountById/${resultSignUp.data.accountId}`);
	expect(resultSignUp.data.accountId).toBe(resultOfGetUser.data.account_id);
});
