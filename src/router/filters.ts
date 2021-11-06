import express, { Request, Response } from 'express';
const cities = require('../constans/cities.json');

const filterRouter = express.Router();

filterRouter.get('/api/filters', (req: Request, res: Response) => {
    const search = req.query.search;
    console.log(search)
    //@ts-ignore
    const searchedCitiies = cities.filter(city => city.Name.toLowerCase().startsWith(search.toLowerCase()));
    console.log(searchedCitiies)
    res.send(searchedCitiies);
});

export { filterRouter };