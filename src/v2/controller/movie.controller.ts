import { Middleware, Route } from "@common/decorator/controller.decorator";
import { RequestHandler } from "express";
import { MovieService } from "../service/movie.service";
import { Assert } from "../utility/assert.utiliy";
import { wrapErr, wrapOk } from "@common/ResponseWrapper";
import { MovieDetailResponse, MovieSearchReponse, PatchMovieRequest, PostMovieRequest } from "../dto/movie.dto";
import { Movie } from "../model/movie.model";
import { isValidObjectId } from "mongoose";
import { PreAuthorizeMw } from "../middleware/security.middleware";
import { ValidationMw } from "../middleware/validation.middleware";
import { containerBase } from "../container.base";

const LoggerMw = containerBase
    .resolve('LoggerFactory')
    .middleware('MovieController');

export class MovieController {
    static readonly inject = ['MovieService'] as const;
    constructor(
        private readonly movieService: MovieService
    ) {}

    @Middleware(LoggerMw)
    @Route("GET", "/")
    getMovies: RequestHandler = async (req, res)=>{
        const {
            title,
            genre,
            minYear,
            maxDur,
            page,
            limit
        } = req.query;

        const truePage  = Assert.map(Assert.int(page,  1), x=>Math.max(1, x))
        const trueLimit = Assert.map(Assert.int(limit, 5), x=>Math.max(1, Math.min(100, x)))

        const movies = await this.movieService.searchMovie({
            title:      Assert.string(title),
            genres:     Assert.string(genre),
            minYear:    Assert.condition(Assert.int(minYear), x=>x>0),
            maxDur:     Assert.condition(Assert.int(maxDur), x=>x>0),
            page:       truePage,
            limit:      trueLimit
        });

        const response: MovieSearchReponse = {
            results:    movies.map(MovieDetailResponse.fromModel),
            total:      movies.length,
            page:       truePage,
            pageSize:   trueLimit
        }
        wrapOk(res).Ok().end(response);
    }

    @Middleware(LoggerMw)
    @Route("GET", "/:id")
    getMovieById: RequestHandler = async (req, res)=>{
        const { id } = req.params;
        if(!isValidObjectId(id))
            return wrapErr(res).BadRequest().end("Invalid id");

        const movie = await Movie.Model.findById(id).exec();
        if(!movie)
            return wrapErr(res).NotFound().end("Movie not found");

        wrapOk(res).Ok().end(MovieDetailResponse.fromModel(movie));
    }

    @Middleware(LoggerMw)
    @Middleware(ValidationMw(PostMovieRequest.validation))
    @Middleware(PreAuthorizeMw(user=>user.role === 'admin'))
    @Route("POST", "/")
    addMovie: RequestHandler = async (req, res)=>{
        const body = req.body as PostMovieRequest;
        const movie = await Movie.Model.create({
            title: body.title,
            genres: body.genres,
            durationMin: body.durationMin,
            synopsis: body.synopsis,
            releasedAt: Assert.map(body.releasedAt, t=>new Date(t))
        });
        wrapOk(res).Created().end(MovieDetailResponse.fromModel(movie));
    }

    @Middleware(LoggerMw)
    @Middleware(ValidationMw(PatchMovieRequest.validation))
    @Middleware(PreAuthorizeMw(user=>user.role === 'admin'))
    @Route("PATCH", "/:id")
    patchMovie: RequestHandler = async (req, res)=>{
        const toPatch = req.body as PatchMovieRequest
        const { id } = req.params;
        if(!isValidObjectId(id))
            return wrapErr(res).BadRequest().end('Invalid Id');
        const movie = await Movie.Model.findById(id).exec();
        if(!movie)
            return wrapErr(res).NotFound().end('Movie not found');
        
        if(toPatch.title)
            movie.set('title', toPatch.title);

        if(toPatch.genres)
            movie.set('genres', toPatch.genres);

        if(toPatch.releasedAt)
            movie.set('releasedAt', new Date(toPatch.releasedAt));

        if(toPatch.synopsis)
            movie.set('synopsis', toPatch.synopsis);

        if(toPatch.durationMin)
            movie.set('durationMin', toPatch.durationMin);

        await movie.save();
        wrapOk(res).NoContent();
    }

    @Middleware(LoggerMw)
    @Middleware(PreAuthorizeMw(user=>user.role === 'admin'))
    @Route("DELETE", "/:id")
    deleteMovie: RequestHandler = async (req, res)=>{
        const { id } = req.params;
        if(!isValidObjectId(id))
            return wrapErr(res).BadRequest().end('Invalid Id');
        await Movie.Model.findByIdAndDelete(id).exec();
        wrapOk(res).NoContent();
    }
}