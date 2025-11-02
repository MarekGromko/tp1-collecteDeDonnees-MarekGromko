import { FilterQuery, Types } from "mongoose";
import { Serie } from "../model/serie.model";
import { Episode } from "../model/episode.model";


export interface SearchSerieOptions {
    title?:     string,
    genres?:    string,
    status?:    string,
    page:       number,
    limit:      number,
}

export interface SearchEpisodeOptions {
    title?:         string,
    minDuration?:   number,
    page:   number,
    limit:  number
}

export class SerieService {
    static readonly inject = [] as const;
    constructor(){}
    
    public async searchSerie(opts: SearchSerieOptions) {
        let filter: FilterQuery<Serie.Model> = {};
        if(opts.title)
            filter.title = { $regex: opts.title, $options: 'i' }
        if(opts.genres)
            filter.genres = { $in: [opts.genres.toLowerCase()] }
        if(opts.status)
            filter.status = opts.status;

        return await Serie.Model.find(filter)
            .sort({ createdAt: 'descending'  })
            .skip((opts.page-1)*opts.limit)
            .limit(opts.limit)
            .exec();
    }
    public async searchEpisode(serieId: string, seasonId: string, opts: SearchEpisodeOptions) {
        let filter: FilterQuery<Episode.Model> = {
            serieRef:  new Types.ObjectId(serieId),
            seasonRef: new Types.ObjectId(seasonId)
        };

        if(opts.title)
            filter.title = { $regex: opts.title, $options: 'i' }
        if(opts.minDuration)
            filter.durationMin = { $gte: opts.minDuration }
        
        return await Episode.Model.find(filter)
            .sort({ epNo: 'ascending' })
            .skip((opts.page-1)*opts.limit)
            .limit(opts.limit)
            .exec();
    }
}