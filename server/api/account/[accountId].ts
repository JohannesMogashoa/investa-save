import { Client, InvestecTransaction } from "investec-api";

import { TransactionsAnalysis } from "~/shared/types";

export default defineEventHandler(async (event) => {
	const accountId = getRouterParam(event, "accountId");

	const { investecApiKey, investecClientId, investecClientSecret } =
		useRuntimeConfig(event);

	const client = await Client.create(
		investecClientId,
		investecClientSecret,
		investecApiKey
	);

	const accounts = await client.getAccounts();

	const account = accounts.find((account) => account.accountId === accountId);

	if (!account) {
		throw new Error("Account not found");
	}

	const balance = await account.getBalance();
	const transactions = await account.getTransactions({});

	const transactionsAnalysis: TransactionsAnalysis = transactions.reduce(
		(acc, transaction) => {
			const { amount, transactionType } = transaction;

			if (!acc[transactionType as string]) {
				acc[transactionType as string] = {
					count: 0,
					totalAmount: 0,
				};
			}

			acc[transactionType as string].count += 1;
			acc[transactionType as string].totalAmount += amount;

			return acc;
		},
		{} as Record<string, { count: number; totalAmount: number }>
	);

	// please build an analysis of the transactions between income & expenses
	const income = transactions
		.filter((transaction) => transaction.type === "CREDIT")
		.reduce((acc, transaction) => acc + transaction.amount, 0);

	const expenses = transactions
		.filter((transaction) => transaction.type === "DEBIT")
		.reduce((acc, transaction) => acc + transaction.amount, 0);

	return {
		balance,
		transactions,
		income,
		expenses,
		transactionsAnalysis,
	};
});
