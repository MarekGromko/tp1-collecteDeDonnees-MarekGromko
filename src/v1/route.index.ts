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