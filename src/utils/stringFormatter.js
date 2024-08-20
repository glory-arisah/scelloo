export const capitalize = (string) => {
	if (typeof string !== 'string')
		throw new Error(`${string} is not string type`)
	if (!string || !string.length) return string

	return `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`
}
