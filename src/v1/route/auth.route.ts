/**
 * @file Router for all authentification services
 */

import { Router } from "express";
import final from "../v1/container.final";

const router = Router();
const authCtrl = final.get('AuthController');
const logger = final.get('LoggerFactory').middleware('AuthRouter');

router.post('/login', logger, authCtrl.postLogin);
router.post('/register', logger, authCtrl.postRegister);

export default router;