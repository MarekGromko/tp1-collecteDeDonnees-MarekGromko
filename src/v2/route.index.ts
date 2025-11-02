import "./setup/ajv.setup";
import "./setup/mongoose.setup";
import { Router } from "express";

const index = Router();

index.use('/auth',      require('./route/auth.route.ts').default);
index.use('/user',      require('./route/user.route.ts').default);
index.use('/movie',     require('./route/movie.route.ts').default);
index.use('/serie',     require('./route/serie.route.ts').default);
index.use('/rating',    require('./route/rating.route.ts').default);

export default index;