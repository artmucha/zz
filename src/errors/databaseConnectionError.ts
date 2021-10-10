import { CustomError } from "./customError";

export class DatabaseConnectionError extends CustomError {
	statusCode = 500;
	message = 'Błąd połączenia z bazą danych';

	constructor(message: string) {
		super(message);

		// potrzebne ponieważ rozszerzam wbudowana klasę
		Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
	};

	serializeErrors() {
		return [{ message: this.message }]
	};
};