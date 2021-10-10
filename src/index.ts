import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { userRouter } from './router/users';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(json());
app.use(userRouter);
app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/hi_app', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        console.log('connected to db')
    } catch(err) {
        console.error(err)
    }

    app.listen(5000, () => {console.log('Listening on port 5000')});
};

start();