/**
 * @file Router for all media services
 */


import { Router } from "express";
import final from "../container.final";

const router = Router();
const serieCtrl           = final.get('SerieController');
const serieValidationMdwr = final.get('SerieValidationMiddleware');
const logger = final.get('LoggerFactory').middleware('SerieRouter');

router.get('/series/:serieId/episodes', logger, serieCtrl.getAllEpisodesFromSerie);
router.post('/series',
    serieValidationMdwr.validateBody, 
    logger,
    serieCtrl.postAddSerie
);
router.post('/seasons/:serieId', logger, serieCtrl.postAddSeasonToSerie);
router.post('/episodes/:serieId', logger, serieCtrl.postAddEpisodesToSerie);
router.patch('/episodes/:episodeId', logger, serieCtrl.patchWatchEpisode);

export default router;