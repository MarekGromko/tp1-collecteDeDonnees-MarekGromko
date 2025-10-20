/**
 * @file Router for all media services
 */


import { Router } from "express";
import final from "../container.final";

const router = Router();
const mediaCtrl = final.resolve('MediaController');
const authMdwr  = final.resolve("AuthMiddleware"); 
const logger    = final.resolve('LoggerFactory').middleware('MediaRouter');

router.get('/medias',       logger, mediaCtrl.getSearchMedia);
router.get('/medias/:id',   logger, mediaCtrl.getMediaById);
router.post('/medias', 
    authMdwr.requireAuthorization(user=>user.role === 'admin'), 
    logger,
    mediaCtrl.postAddMedia
);
router.put('/medias/:id', 
    authMdwr.requireAuthorization(user=>user.role === 'admin'), 
    logger,
    mediaCtrl.putModifyMedia
);
router.delete('/medias/:id', 
    authMdwr.requireAuthorization(user=>user.role === 'admin'), 
    logger,
    mediaCtrl.deleteMediaById
);

export default router;