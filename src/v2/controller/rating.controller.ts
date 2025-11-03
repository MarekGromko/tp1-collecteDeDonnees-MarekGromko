import { RequestHandler, Response } from "express";
import { AuthorizedRequest, PreAuthorizeMw } from "../middleware/security.middleware";
import { Middleware, Route } from "@common/decorator/controller.decorator";
import { ValidationMw } from "../middleware/validation.middleware";
import { PostRatingRequest, RatingDetailResponse } from "../dto/rating.dto";
import { Rating } from "../model/rating.model";
import mongoose, { isValidObjectId, Types } from "mongoose";
import { Movie } from "../model/movie.model";
import { wrapErr, wrapOk } from "@common/ResponseWrapper";
import { Episode } from "../model/episode.model";
import { Serie } from "../model/serie.model";
import { containerBase } from "../container.base";

const LoggerMw = containerBase
    .resolve('LoggerFactory')
    .middleware('RatingController');

export class RatingController {
    static readonly inject = [] as const;
    constructor(){}
    
    @Middleware(LoggerMw)
    @Middleware(PreAuthorizeMw())
    @Middleware(ValidationMw(PostRatingRequest.validate))
    @Route('POST', '/')
    async postRating(req: AuthorizedRequest, res: Response){
        const user = req.principal;
        const rating = req.body as PostRatingRequest;
        switch(rating.target) {
            case 'Movie':
                if(!await Movie.Model.findById(rating.targetId).exec())
                    return wrapErr(res).NotFound().end("Movie not found");
                break
            case 'Episode':
                if(!await Episode.Model.findById(rating.targetId).exec())
                    return wrapErr(res).NotFound().end("Episode not found");
                break;
        }
        const result = await Rating.Model.create({
            userRef: user._id,
            review:  rating.review,
            score:   rating.score,
            targetKind: rating.target,
            targetRef:  new Types.ObjectId(rating.targetId)
        });
        wrapOk(res).Created().end(RatingDetailResponse.fromModel(result));
    }

    @Route("GET", "/avg/movie/:movieId")
    movieRatingAverage: RequestHandler = async (req, res)=>{
        const { movieId } = req.params;
        if(!isValidObjectId(movieId))
            return wrapErr(res).BadRequest().end("Invalid movie id");
        const movie = Movie.Model.findById(movieId);
        if(!movie) 
            return wrapErr(res).NotFound().end("Movie not found");
        ///
        let result = (await Rating.Model.aggregate([
            { $match: { targetKind: 'Movie', targetRef: new Types.ObjectId(movieId) } },
            { $group: {
                _id: null,
                averageScore: { $avg: "$score" },
                count: { $sum: 1 }
            } },
            { $project: { averageScore: 1, count: 1 }}
        ]).exec())[0] || {averageScore: 0, count: 0};
        return wrapOk(res).Ok().end({count: result.count, average: result.averageScore});
    }

    @Route("GET", "/avg/serie/:serieId")
    serieRatingAverage: RequestHandler = async (req, res)=>{
        const { serieId } = req.params;
        if(!isValidObjectId(serieId))
            return wrapErr(res).BadRequest().end("Invalid serie id");
        const movie = Serie.Model.findById(serieId);
        if(!movie) 
            return wrapErr(res).NotFound().end("Serie not found");
        ///
        let result = (await Rating.Model.aggregate([
            { $match: { targetKind: 'Episode' } },
            { $lookup: {
                from: 'episodes',
                localField: 'targetRef',
                foreignField: '_id',
                as: 'episode'
            } },
            { $unwind: '$episode' },
            { $match: { 'episode.serieRef': new Types.ObjectId(serieId) }},
            { $group: {
                _id: null,
                averageScore: { $avg: "$score" },
                count: { $sum: 1 }
            } },
            { $project: { averageScore: 1, count: 1 }}
        ]).exec())[0] || {averageScore: 0, count: 0};
        return wrapOk(res).Ok().end({count: result.count, average: result.averageScore});
    }
}