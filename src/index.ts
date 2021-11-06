import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import cors from 'cors';

import { userRouter } from './router/users';
import  { filterRouter } from './router/filters'
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(json());
app.use(cookieSession({
    signed: false,
    // secure: true
}));
app.use(cors());

app.use(userRouter);
app.use(filterRouter);
app.use(errorHandler);

const start = async () => {
    if(!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
    try {
        await mongoose.connect('mongodb://localhost:27017/zz_app', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        console.log('connected to db')
    } catch(err) {
        console.error(err)
    }

    app.listen(5000, () => {console.log('Listening on port 5000')});
};

start();