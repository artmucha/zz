import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export default class Password {
    static async toHash(password: string){
        const salt = randomBytes(8).toString('hex');
        const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buffer.toString('hex')}.${salt}`;
    };

    static async compare(storedPAssword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPAssword.split('.');
        const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

        return buffer.toString('hex') === hashedPassword;
    }
};