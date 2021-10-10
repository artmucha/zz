import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import User from '../models/User';

import { RequestValidationError } from '../errors/requestValidationErrors';
import { BadRequestError } from '../errors/badRequestError';

const userRouter = express.Router();

userRouter.get('/api/users/currentuser', (req, res) => {
    res.send('Hi there!');
});

userRouter.post('/api/users/signup', [
	body('email')
		.isEmail()
		.withMessage('Podaj poprawny adres email'),
	body('password')
		.trim()
		.isLength({ min: 6, max: 20 })
		.withMessage('Hasło musi mieć od 6 do 20 znaków')
	], 
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if(!errors.isEmpty()) {
			throw new RequestValidationError(errors.array());
		}

		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError('Użytkownik z tym adresem email już istnieje');
		}

		const user = new User({ email, password });
		await user.save();

		console.log(user);
		res.status(201).send(user);

	}
);

userRouter.post('/api/users/signin', (req, res) => {
  res.send('Hi there!');
});

userRouter.post('/api/users/signout', (req, res) => {
  res.send('Hi there!');
});

export { userRouter };