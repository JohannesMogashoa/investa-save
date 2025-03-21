export function splitByCapitalLetter(text: string): string {
	// Split by capital letter followed by a lowercase letter
	let result = text.replace(/([A-Z])(?=[a-z])/g, " $1").trim();

	// Lowercase specific conjunction words
	result = result.replace(/\b(And|Or)\b/g, (match) => match.toLowerCase());

	return result;
}
