import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import Post from '../models/Post';
import { currentUser } from '../middlewares/currentUser';
import { validateRequest } from '../middlewares/validateRequest';
import { requireAuth } from '../middlewares/requireAuth';
import { NotFoundError } from '../errors/notFoundError';
import { NotAuthorizedError } from '../errors/notAuthorizedError';

const postRouter = express.Router();

postRouter.get('/api/posts', async (req: Request, res: Response) => {
	const type = req.params.type ? { 'type' : req.params.type } : {};
	const category = req.params.category ? { 'category': req.params.category } : {};
	const location = req.query.location ? { 'location': req.query.location } : {};
	const price = req.query.price ? { 'price': req.query.price } : {};

	try {
		//@ts-ignore
		const posts = await Post.find({...type, ...category, ...location, ...price}).sort({createdAt: 'desc'});
		res.status(200).send(posts);
	  } catch (error) {
		throw new NotFoundError();
	}
});

postRouter.get('/api/posts/:slug', async (req: Request, res: Response) => {
	const slug = req.params.slug ? { 'slug' : req.params.slug } : {};

	try {
		const post = await Post.findOne(slug);
		res.status(200).send(post);
	  } catch (error) {
		throw new NotFoundError();
	}
});

postRouter.post('/api/posts', 
// currentUser, requireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Tytuł jest wymagany'),
        body('description')
            .not()
            .isEmpty()
            .withMessage('Opis jest wymagany'),
        body('location')
            .not()
            .isEmpty()
            .withMessage('Podaj lokalizację'),
		body('category')
            .not()
            .isEmpty()
            .withMessage('Wybierz kategorię'),
		body('type')
            .not()
            .isEmpty()
            .withMessage('Określ rodzaj ogłoszenia'),
    ], 
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, description, location, category, price, type, date } = req.body;

        const post = new Post({ 
			title, 
			description, 
			location, 
			category,
			type,
			price, 
			date,
			userId: req.currentUser!._id
		});

		await post.save();
		res.status(201).send(post);
    }
);

postRouter.put('/api/posts/:slug', 
	// requireAuth,
	[
        body('title')
            .not()
            .isEmpty()
            .withMessage('Tytuł jest wymagany'),
        body('description')
            .not()
            .isEmpty()
            .withMessage('Opis jest wymagany'),
        body('location')
            .not()
            .isEmpty()
            .withMessage('Podaj lokalizację'),
		body('category')
            .not()
            .isEmpty()
            .withMessage('Wybierz kategorię'),
		body('type')
            .not()
            .isEmpty()
            .withMessage('Określ rodzaj ogłoszenia'),
    ], 
    validateRequest,
	async (req: Request, res: Response) => {
	const slug = req.params.slug ? { 'slug' : req.params.slug } : {};
	const { title, description, location, category, price, type, date } = req.body;

	const post = await Post.findOne(slug);

	if(!post) { throw new NotFoundError() };

	if(post.userId !== req.currentUser!._id){
		throw new NotAuthorizedError();
	}

	post.set({ 
		title, 
		description, 
		location, 
		category,
		type,
		price,
	});

	await post.save();
	res.status(200).send(post);

});

export { postRouter };