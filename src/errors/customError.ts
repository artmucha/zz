export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
		super(message);

		// potrzebne ponieważ rozszerzam wbudowana klasę
		Object.setPrototypeOf(this, CustomError.prototype);
  };

	abstract serializeErrors(): { message: string, field?: string }[];
};