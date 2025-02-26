import { Client } from "investec-api";

export default defineEventHandler(async (event) => {
	const { investecApiKey, investecClientId, investecClientSecret } =
		useRuntimeConfig(event);

	const client = await Client.create(
		investecClientId,
		investecClientSecret,
		investecApiKey
	);

	const accounts = await client.getAccounts();

	return accounts;
});
