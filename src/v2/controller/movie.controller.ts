import { Route } from "@common/decorator/controller.decorator";
import { RequestHandler } from "express";
import { MovieService } from "../service/movie.service";
import { Assert } from "../utility/assert.utiliy";
import { wrapOk } from "@common/ResponseWrapper";
import { MovieSearchReponse } from "../dto/media.dto";


export class MovieController {
    static readonly inject = ['MovieService'] as const;
    constructor(
        private readonly movieService: MovieService
    ) {}
    @Route("GET", "/")
    getMovies: RequestHandler =  async (req, res)=>{
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
            genre:      Assert.string(genre),
            minYear:    Assert.condition(Assert.int(minYear), x=>x>0),
            maxDur:     Assert.condition(Assert.int(maxDur), x=>x>0),
            page:       truePage,
            limit:      trueLimit
        });

        const response: MovieSearchReponse = {
            results: movies.map(movie=>({
                id:             movie._id.toHexString(),
                title:          movie.title,
                genres:         movie.genres,
                durationMin:    movie.durationMin,
                synopsis:       movie.synopsis || null,
                relasedAt:      movie.releasedAt?.toISOString() || null
            })),
            total:      movies.length,
            page:       truePage,
            pageSize:   trueLimit
        }
        wrapOk(res).Ok().end(response);
    }
}