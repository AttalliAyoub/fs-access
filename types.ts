/**
 * Enum representing file access modes for checking file accessibility
 * Similar to Node.js fs.constants access modes
 * fs.constants.F_OK - Check for existence (default)
 * fs.constants.R_OK - Check for read permission
 * fs.constants.W_OK - Check for write permission
 * fs.constants.X_OK - Check for execute permission
 */
export enum AccessMode {
	/** Check for file existence only */
	F_OK = 0,
	/** Check for read permission */
	R_OK = 4,
	/** Check for write permission */
	W_OK = 2,
	/** Check for execute permission */
	X_OK = 1,
}

/**
 * Convert an AccessMode enum value to a string
 * @param mode - The AccessMode enum value to convert
 * @returns The string representation of the AccessMode
 */
export function AccessMode2String(mode?: AccessMode) {
	switch (mode) {
		case AccessMode.F_OK:
			return "Exists";
		case AccessMode.R_OK:
			return "Readable";
		case AccessMode.W_OK:
			return "Writable";
		case AccessMode.X_OK:
			return "Executable";
		default:
			return "";
	}
}
