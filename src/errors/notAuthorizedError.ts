import { CustomError } from "./customError";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Not Autorized');

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors() {
        return [{ message: 'Musisz być zalogowany' }];
    }
};