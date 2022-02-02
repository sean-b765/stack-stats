export const stringToBoolean = (str: string, fallback: boolean) => {
	switch (str.toLowerCase()) {
		case 'yes':
		case '1':
		case 'true':
			return true
		case 'no':
		case '0':
		case 'false':
			return false
		default:
			return fallback
	}
}
