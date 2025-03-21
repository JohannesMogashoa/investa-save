const formatAmount = (amount: number) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "ZAR",
	}).format(amount);
};

export default formatAmount;
