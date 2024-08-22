export const capitalize = (string) => {
	if (typeof string !== 'string')
		throw new Error(`${string} is not string type`)
	if (!string && !string.trim()) return string

	return `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`
}

const splitStringByDelimiter = (string, delimiter) => {
	let regexDelimiter
	if (typeof delimiter === 'string') {
		regexDelimiter = new RegExp(delimiter, 'g')
	} else if (delimiter instanceof RegExp) {
		regexDelimiter = delimiter
	} else {
		throw new Error('Delimiter must be a string or a RegExp')
	}

	return string.split(regexDelimiter)
}

export const splitAndCapitalizeStringByDelimiter = (string, delimiter) => {
	if (!delimiter || (!string && !string.trim())) return string

	return splitStringByDelimiter(string, delimiter)
		.map((str) => capitalize(str))
		.join(' ')
}
