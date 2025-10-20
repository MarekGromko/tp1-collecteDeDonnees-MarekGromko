/**
 * @file Router for all media services
 */


import { Router } from "express";
import final from "../container.final";

const router = Router();
const userCtrl = final.resolve('UserController');
const logger = final.resolve('LoggerFactory').middleware('SerieRouter');

router.get('/users/:id/medias', logger, userCtrl.getUserFavoriteMedias);

export default router;