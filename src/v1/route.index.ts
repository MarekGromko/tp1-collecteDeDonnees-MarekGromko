import dotenv from "dotenv"
dotenv.config({quiet: true});

import {Router} from "express"
import cookieParser from 'cookie-parser';

const index = Router();
index.use(cookieParser());
index.use(require('./route/auth.route.ts').default);
index.use(require('./route/film.route.ts').default);
index.use(require('./route/media.route.ts').default);
index.use(require('./route/serie.route.ts').default);
index.use(require('./route/user.route.ts').default);

export default index;
// app.listen(SERVER_PORT, ()=>{
//     console.log(`listening on port ${SERVER_PORT}`);
// });