import "./setup/ajv.setup";
import "./setup/mongoose.setup";
import { Router } from "express";

const index = Router();

index.use('/auth', require('./route/auth.route.ts').default);
index.use('/user', require('./route/user.route.ts').default);

export default index;