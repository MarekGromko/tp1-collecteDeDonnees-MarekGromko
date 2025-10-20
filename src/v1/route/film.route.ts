/**
 * @file Router for all film services
 */

import { Router } from "express";
import final from "../v1/container.final";

const router = Router();
const filmCtrl = final.get('FilmController');
const filmValidationMdwr = final.get('FilmValidationMiddleware');
const logger = final.get('LoggerFactory').middleware('FilmRouter');

router.post('/films', 
    filmValidationMdwr.validateBody, 
    logger,
    filmCtrl.postAddFilm
);

export default router;