import axios from 'axios';

axios.defaults.validateStatus = function () {
  return true;
};

//Integration test
test('Deve criar uma conta para o passageiro e consultar conta', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  const resultSignUp = await axios.post('http://localhost:3000/signup', input);
  const resultOfGetUser = await axios.get(`http://localhost:3000/getAccountById/${resultSignUp.data.accountId}`);
  expect(resultSignUp.data.accountId).toBe(resultOfGetUser.data.account_id);
  expect(input.name).toBe(resultOfGetUser.data.name);
  expect(input.email).toBe(resultOfGetUser.data.email);
  expect(input.cpf).toBe(resultOfGetUser.data.cpf);
});

test('Não deve criar uma conta para o passageiro com nome invalido', async function () {
  const input = {
    name: 'John',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  const resultSignUp = await axios.post('http://localhost:3000/signup', input);
  expect(resultSignUp.status).toBe(422);
  expect(resultSignUp.data).toEqual({ error: 'Some error ocurred in signup Error: Invalid name' });
});
