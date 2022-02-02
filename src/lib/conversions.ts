/**
 * Author: Sean Boaden
 * Date: 02/02/2022
 * Description: Converts a string to boolean
 */

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
