import { FilterQuery } from "mongoose";
import { Movie } from "../model/movie.model";

export interface SearchMovieOptions {
    title?: string,
    genres?: string,
    minYear?: number,
    maxDur?: number,
    page:   number,
    limit:  number,
}

export class MovieService {
    static readonly inject = [] as const;
    async searchMovie(opts: SearchMovieOptions) {
        let filter: FilterQuery<Movie.Model> = {}
        if(opts.title)
            filter.title = { $regex: opts.title, $options: 'i'}
        if(opts.genres)
            filter.genres = { $in: [opts.genres.toLowerCase()] }
        if(opts.minYear)
            filter.releaseAt = { $gte: new Date(opts.minYear, 0, 0, 0, 0, 0, 0) }
        if(opts.maxDur)
            filter.durationMin = { $lte: opts.maxDur }

        return await Movie.Model.find(filter)
            .sort({ releasdeAt: 1})
            .skip((opts.page-1) * opts.limit)
            .limit(opts.limit)
            .exec();
    }
}