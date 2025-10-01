import dotenv from "dotenv"
dotenv.config({quiet: true});

import express from "express"
import cookieParser from 'cookie-parser';

const SERVER_PORT = process.env.SERVER_PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api', require('./route/auth.route.ts').default);
app.use('/api', require('./route/film.route.ts').default);
app.use('/api', require('./route/media.route.ts').default);
app.use('/api', require('./route/serie.route.ts').default);
app.use('/api', require('./route/user.route.ts').default);

app.listen(SERVER_PORT, ()=>{
    console.log(`listening on port ${SERVER_PORT}`);
});