/**
 * @file Router for all film services
 */

import { Router } from "express";
import final from "../container.final";

const router = Router();
const filmCtrl = final.resolve('FilmController');
const filmValidationMdwr = final.resolve('FilmValidationMiddleware');
const logger = final.resolve('LoggerFactory').middleware('FilmRouter');

router.post('/films', 
    filmValidationMdwr.validateBody, 
    logger,
    filmCtrl.postAddFilm
);

export default router;