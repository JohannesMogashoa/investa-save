import type {
	InvestecAccountBalance,
	InvestecTransaction,
	InvestecTransactionTransactionType,
} from "investec-api";

export interface AccountDetail {
	balance: InvestecAccountBalance;
	transactions: InvestecTransaction[];
	transactionsAnalysis: TransactionsAnalysis;
}

export type TransactionsAnalysis = {
	[transactionType: string]: {
		count: number;
		totalAmount: number;
	};
};
