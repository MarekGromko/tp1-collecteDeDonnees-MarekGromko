import type { Request, Response } from "express";
import { MediaService } from "../service/MediaService";
import { wrapOk } from "../utility/ResponseWrapper";

/**
 * Controller for all medias related endpoint
 * @requires MediaService
 */
class MediaController {
    static readonly inject = ['MediaService'] as const;
    constructor(
        private service: MediaService
    ){
        this.deleteMediaById = this.deleteMediaById.bind(this);
        this.getMediaById = this.getMediaById.bind(this);
        this.getSearchMedia = this.getSearchMedia.bind(this);
        this.postAddMedia = this.postAddMedia.bind(this);
        this.putModifyMedia = this.putModifyMedia.bind(this);
    }
    /**
     * Endpoint to search on media title, genre, type and/or year
     * Return all media if no options
     */
    public getSearchMedia(req: Request, res: Response) {
        const options = {
            title: req.query.title as string,
            genre: req.query.genre as string,
            type: req.query.type as string,
            year: Number(req.query.year) || undefined,
        }
        const medias = this.service.searchMedias(options);
        wrapOk(res).Ok().end(medias);
    }
    /**
     * Endpoint to get a media by id
     * 
     * ### Expected params
     *  - `:id` - id of the media
     */
    public getMediaById(req: Request, res: Response) {
        const {id} = req.params;
        const medias = this.service.getMediaById(id);
        wrapOk(res).Ok().end(medias);
    }
    /**
     * Endpoint to add a media
     */
    public postAddMedia(req: Request, res: Response) {
        const media = req.body;
        this.service.addMedia(media);
        wrapOk(res).NoContent();
    }
    /**
     * Endpoint to modify a media
     * 
     * ### Expected params
     *  - `:id` - id of the media
     */
    public putModifyMedia(req: Request, res: Response) {
        const {id} = req.params;
        const media = req.body;
        this.service.modifyMedia(id, media);
        wrapOk(res).NoContent();
    }
    /**
     * Endpoint to delete a media
     * 
     * ### Expected params
     *  - `:id` - id of the media
     */
    public deleteMediaById(req: Request, res: Response) {
        const {id} = req.params;
        this.service.deleteMedia(id);
        wrapOk(res).NoContent();
    }
}

export {
    MediaController
}