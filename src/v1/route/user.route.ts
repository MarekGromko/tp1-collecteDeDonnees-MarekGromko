/**
 * @file Router for all media services
 */


import { Router } from "express";
import final from "../v1/container.final";

const router = Router();
const userCtrl = final.get('UserController');
const logger = final.get('LoggerFactory').middleware('SerieRouter');

router.get('/users/:id/medias', logger, userCtrl.getUserFavoriteMedias);

export default router;