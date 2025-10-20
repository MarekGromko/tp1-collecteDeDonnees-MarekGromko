/**
 * @file Router for all authentification services
 */

import { Router } from "express";
import final from "../container.final";

const router = Router();
const authCtrl = final.resolve('AuthController');
const logger = final.resolve('LoggerFactory').middleware('AuthRouter');

router.post('/login', logger, authCtrl.postLogin);
router.post('/register', logger, authCtrl.postRegister);

export default router;