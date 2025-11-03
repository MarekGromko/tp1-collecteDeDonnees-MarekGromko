import { Middleware, Route } from "@common/decorator/controller.decorator";
import { RequestHandler } from "express";
import { Assert } from "../utility/assert.utiliy";
import { wrapErr, wrapOk } from "@common/ResponseWrapper";
import { SerieService } from "../service/serie.service";
import { PostSerieRequest, SerieDetailResponse, SerieSearchResponse } from "../dto/serie.dto";
import { ValidationMw } from "../middleware/validation.middleware";
import { PreAuthorizeMw } from "../middleware/security.middleware";
import { Serie } from "../model/serie.model";
import { isValidObjectId, Types } from "mongoose";
import { Season } from "../model/season.mode";
import { PostSeasonRequest, SeasonDetailResponse } from "../dto/season.dto";
import { EpisodeDetailResponse, EpisodeSearchResponse, PostEpisodeRequest } from "../dto/episode.dto";
import { Episode } from "../model/episode.model";
import { containerBase } from "../container.base";

const LoggerMw = containerBase
    .resolve('LoggerFactory')
    .middleware('SerieController');

const ValidateParamSerieIdMw: RequestHandler = async (req, res, next)=>{
    const { serieId } = req.params;
    if(!isValidObjectId(serieId))
        return wrapErr(res).BadRequest().end('Invalid serie Id');
    const serie = await Serie.Model.findById(serieId);
    if(!serie)
        return wrapErr(res).NotFound().end('Serie not found');
    next();
}
const ValidateParamEpisodeIdMw: RequestHandler = async (req, res, next)=>{
    const { seasonId } = req.params;
    if(!isValidObjectId(seasonId))
        return wrapErr(res).BadRequest().end('Invalid season Id');
    const season = await Season.Model.findById(seasonId);
    if(!season)
        return wrapErr(res).NotFound().end('Season not found');
    next();
}

export class SerieController {
    static readonly inject = ['SerieService'] as const;
    constructor(
        private readonly serieService: SerieService
    ) {}

    @Route("GET", "/")
    getSeries: RequestHandler = async (req, res)=>{
        const {
            title,
            genre,
            status,
            page,
            limit
        } = req.query;

        const truePage  = Assert.map(Assert.int(page,  1), x=>Math.max(1, x))
        const trueLimit = Assert.map(Assert.int(limit, 5), x=>Math.max(1, Math.min(100, x)))

        const series = await this.serieService.searchSerie({
            title:      Assert.string(title),
            genres:     Assert.string(genre),
            status:     Assert.enums(status, ['ongoing', 'ended']),
            page:       truePage,
            limit:      trueLimit
        });

        const response: SerieSearchResponse = {
            results:    series.map(SerieDetailResponse.fromModel),
            total:      series.length,
            page:       truePage,
            pageSize:   trueLimit
        }
        wrapOk(res).Ok().end(response);
    }

    @Middleware(PreAuthorizeMw(user=>user.role === 'admin'))
    @Middleware(ValidationMw(PostSerieRequest.validation))
    @Route("POST", "/")
    addSerie: RequestHandler = async (req, res)=>{
        const body = req.body as PostSerieRequest;
        const serie = await Serie.Model.create({
            title: body.title,
            genres: body.genres,
            status: body.status
        });
        wrapOk(res).Created().end(SerieDetailResponse.fromModel(serie));
    }

    @Middleware(PreAuthorizeMw(user=>user.role === 'admin'))
    @Middleware(ValidationMw(PostSeasonRequest.validation))
    @Middleware(ValidateParamSerieIdMw)
    @Route("POST", "/:serieId/season")
    addSeason: RequestHandler = async (req, res)=>{
        const { serieId } = req.params;
        const body = req.body as PostSeasonRequest;
        const season = await Season.Model.create({
            serieRef: new Types.ObjectId(serieId),
            seasonNo: body.seasonNo,
            episodeNb: body.episodeNb || 0,
        })
        ///
        wrapOk(res).Created().end(SeasonDetailResponse.fromModel(season));
    }

    @Middleware(PreAuthorizeMw(user=>user.role === 'admin'))
    @Middleware(ValidationMw(PostEpisodeRequest.validation))
    @Middleware(ValidateParamSerieIdMw)
    @Middleware(ValidateParamEpisodeIdMw)
    @Route("POST", "/:serieId/season/:seasonId/episode")
    addEpisode: RequestHandler = async (req, res)=>{
        const { serieId, seasonId } = req.params;
        const body = req.body as PostEpisodeRequest;
        ///
        const episode = await Episode.Model.create({
            title: body.title,
            serieRef: new Types.ObjectId(serieId),
            seasonRef: new Types.ObjectId(seasonId),
            epNo: body.epNo,
            durationMin: body.durationMin
        })
        ///
        wrapOk(res).Created().end(EpisodeDetailResponse.fromModel(episode));
    }

    @Middleware(ValidateParamSerieIdMw)
    @Middleware(ValidateParamEpisodeIdMw)
    @Route("GET", "/:serieId/season/:seasonId/episode")
    getEpisodes: RequestHandler = async (req, res)=>{
        const { serieId, seasonId } = req.params;
        const {
            title,
            minDuration,
            page,
            limit
        } = req.query;

        const truePage  = Assert.map(Assert.int(page,  1), x=>Math.max(1, x))
        const trueLimit = Assert.map(Assert.int(limit, 5), x=>Math.max(1, Math.min(100, x)))

        const episodes = await this.serieService.searchEpisode(serieId, seasonId, {
            title:          Assert.string(title),
            minDuration:    Assert.condition(Assert.int(minDuration), x=>x>=0),
            page:   truePage,
            limit:  trueLimit
        });
        ///
        const response: EpisodeSearchResponse = {
            results:    episodes.map(EpisodeDetailResponse.fromModel),
            total:      episodes.length,
            page:       truePage,
            pageSize:   trueLimit
        }
        wrapOk(res).Ok().end(response);
    }
}