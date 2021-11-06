import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import Password from '../services/password';
import { currentUser } from '../middlewares/currentUser';
import { validateRequest } from '../middlewares/validateRequest';
import { requireAuth } from '../middlewares/requireAuth';
import { BadRequestError } from '../errors/badRequestError';

const userRouter = express.Router();

userRouter.get('/api/users/currentuser', currentUser, requireAuth, (req: Request, res: Response) => {
	res.send({ currentUser: req.currentUser || null});
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
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError('Użytkownik z tym adresem email już istnieje');
		}

		const user = new User({ email, password });
		await user.save();

		const userJWT = jwt.sign({
				_id: user._id,
				email: user.email
			}, 
			process.env.JWT_KEY!
		);

		req.session = { jwt: userJWT };
		res.status(201).send(user);

	}
);

userRouter.post('/api/users/signin',
	[
		body('email')
			.isEmail()
			.withMessage('Podaj poprawny adres email'),
		body('password')
			.trim()
			.notEmpty()
			.withMessage('Podaj prawidłowe hasło')
	], 
	validateRequest,
 	async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if(!user) throw new BadRequestError('Niepoprawny adres e-mail');
		
		const isPasswordMatch = await Password.compare(user.password, password);
		if (!isPasswordMatch) throw new BadRequestError('Niepoprawne hasło');

		const userJWT = jwt.sign({
				_id: user._id,
				email: user.email
			}, 
			process.env.JWT_KEY!
		);

		req.session = { jwt: userJWT };
		res.status(200).send(user);
	}
);

userRouter.post('/api/users/signout', (req: Request, res: Response) => {
  req.session = null;
  res.send({});
});

export { userRouter };