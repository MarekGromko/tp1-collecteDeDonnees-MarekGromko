import type { Request, Response } from "express";
import { SerieService } from "../service/SerieService.ts";
import { wrapErr, wrapOk } from "../utility/ResponseWrapper.ts";
import { LoggerFactory, Logger } from "../../common/LoggerFactory.ts";

/**
 * Controller for all serie related endpoint
 * @requires SerieService
 * @requires LoggerFactory
 */
class SerieController {
    static readonly inject = ['SerieService', 'LoggerFactory'] as const;
    private logger: Logger;
    constructor(
        private service: SerieService,
        loggerFactory: LoggerFactory
    ){
        this.logger = loggerFactory.service('SerieController');
        this.getAllEpisodesFromSerie = this.getAllEpisodesFromSerie.bind(this);
        this.patchWatchEpisode = this.patchWatchEpisode.bind(this);
        this.postAddEpisodesToSerie = this.postAddEpisodesToSerie.bind(this);
        this.postAddSeasonToSerie = this.postAddSeasonToSerie.bind(this);
        this.postAddSerie = this.postAddSerie.bind(this);
    }
    /**
     * Endpoint to get all episodes from a serie
     * 
     * ### Expected params
     *  - `:serieId` - id of the serie
     */
    public getAllEpisodesFromSerie(req: Request, res: Response) {
        const {serieId} = req.params;
        const result = this.service.getAllEpisodes(serieId);
        switch(result) {
            case 'SerieNonexistent':
                wrapErr(res).NotFound().end('serie not found');
                break;
            default:
                wrapOk(res).Ok().end(result);
        }
    }
    /**
     * Endpoint to add a serie
     */
    public postAddSerie(req: Request, res: Response) {
        const serie = req.body;
        this.service.addSerie(serie)
        wrapOk(res).NoContent();
    }
    /**
     * Endpoint to add a season to a serie
     * 
     * ### Expected params
     *  - `:serieId` - id of the serie
     */
    public postAddSeasonToSerie(req: Request, res: Response) {
        const {serieId} = req.params;
        const season = req.body;
        switch(this.service.addSeason(serieId, season)) {
            case 'SerieNonexistent':
                this.logger.error(`Can't add season to non-existent serie [${serieId}]`)
                wrapErr(res).NotFound().end('serie not found');
                break;
            default:
                wrapOk(res).NoContent();
        };
    }
    /**
     * Endpoint to add an episode to a serie
     * 
     * ### Expected params
     *  - `:serieId` - id of the serie
     */
    public postAddEpisodesToSerie(req: Request, res: Response) {
        const {serieId} = req.params;
        const episode = req.body;
        switch(this.service.addEpisode(serieId, episode)) {
            case 'SerieNonexistent':
                this.logger.error(`Can't add episode to non-existent serie [${serieId}]`)
                wrapErr(res).NotFound().end('serie not found');
                break;
            default:
                wrapOk(res).NoContent();

        };
    }
    /**
     * Endpoint to mark an episode as watched
     * 
     * ### Expected params
     *  - `:episodeId` - id of the episode
     */
    public patchWatchEpisode(req: Request, res: Response) {
        const {episodeId} = req.params;
        switch(this.service.watchEpisode(episodeId)) {
            case 'EpisodeNonexistent':
                wrapErr(res).NotFound().end('episode not found');
                break;
            default: 
                wrapOk(res).NoContent();
        };
    }
}

export { SerieController }