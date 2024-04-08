import express from "express";
import Signup from "./application/usecase/Signup";
import GetAccount from "./application/usecase/GetAccount";
import AccountDAODatabase from "./infra/DAODatabase/AccountDAODatabase";
const app = express();
app.use(express.json());


app.post("/signup", async function (req, res) {
	const accountDAO = new AccountDAODatabase();
	const signup = new Signup(accountDAO)
	const resultOfSignup = await signup.execute(req.body)
	res.json(resultOfSignup)
});

app.get("/getAccountById/:accountId", async function (req, res) {
	const accountDAO = new AccountDAODatabase();
	const getAccount = new GetAccount(accountDAO)
	const resultOfGetAccount = await getAccount.execute(req.params.accountId)
	res.json(resultOfGetAccount)
})

app.listen(3000, () => {
	console.log(`Server running on port 3000 ⛇`);
});

