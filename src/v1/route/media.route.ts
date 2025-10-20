/**
 * @file Router for all media services
 */


import { Router } from "express";
import final from "../v1/container.final";

const router = Router();
const mediaCtrl = final.get('MediaController');
const authMdwr  = final.get("AuthMiddleware"); 
const logger    = final.get('LoggerFactory').middleware('MediaRouter');

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