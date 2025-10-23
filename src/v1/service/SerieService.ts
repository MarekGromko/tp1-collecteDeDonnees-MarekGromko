import { ServiceResult } from "../core/common";
import { IDataLayer, WhereFn } from "../core/IDataLayer";
import { IEpisode, ISeason, ISerie, UnknownMedia } from "../core/IMedia";
import Episode from "../model/Episode";
import Season from "../model/Season";
import Serie from "../model/Serie";

const serieMapper = (data: any)=>data ? Serie.from(data) : null
const serieWhere  = (serieId: string): WhereFn<UnknownMedia> => (row: UnknownMedia) => row.mediaType === 'serie' && row.id == serieId;

class SerieService {
    static readonly inject = ['IDataLayer'] as const;
    constructor(
        private db: IDataLayer,
    ) {}
    getAllEpisodes(serieId: string): ServiceResult<'SerieNonexistent',Episode[]> {
        const serie = this.db.read<ISerie>('media', {
            map:    serieMapper,
            where:  serieWhere(serieId),
            limit:  1
        })[0];
        if(!serie) return 'SerieNonexistent';
        return serie.seasons
            .map(season=>season.episodes)
            .flat();
    }
    addSerie(serie: ISerie): ServiceResult<'InvalidField'> {
        this.db.insert('media', {
            values: key=>[{
                ...serie, 
                mediaType: 'serie',
                id: key,
                seasons: []
            }]
        });
    }
    addSeason(serieId: string, season: ISeason): ServiceResult<'SerieNonexistent'> {
        const {db} = this;
        db.pullDb();
        const serie = db.read<ISerie>('media', {
            map:    serieMapper, 
            where:  serieWhere(serieId),
            limit:  1
        })[0];
        if(!serie)
            return db.abortDb(), 'SerieNonexistent';
        serie.seasons.push(Season.from({...season, seasonNumber: serie.seasons.length}));
        db.update<ISerie>('media', {
            where: serieWhere(serieId),
            set: ()=>serie
        })
        db.pushDb();
    }
    addEpisode(serieId: string, episode: IEpisode): ServiceResult<'SerieNonexistent'> {
        const {db} = this;
        db.pullDb();
        const serie = db.read<ISerie>('media', {
            map:    serieMapper, 
            where:  serieWhere(serieId),
            limit:  1
        })[0];
        if(!serie || serie.seasons.length == 0)
            return db.abortDb(), 'SerieNonexistent';
        serie.seasons.at(-1)?.episodes.push(episode);
        db.update<ISerie>('media', {
            where: serieWhere(serieId),
            set: ()=>serie
        })
        db.pushDb();
    }
    watchEpisode(episodeId: string): ServiceResult<'EpisodeNonexistent'> {
        const {db} = this;
        db.pullDb();
        const serie = db.read<ISerie>('media', {
            map:    serieMapper,
            where:  row=>row.mediaType == 'serie' && row.seasons.some(
                        season=>season.episodes.some(
                            episode=>episode.id == episodeId)),
            limit:  1
        })[0]
        if(!serie) return db.abortDb(), 'EpisodeNonexistent';
        const episode = serie.seasons
            .map(season=>season.episodes)
            .flat()
            .find(episode=>episode.id == episodeId);
        if(!episode) return db.abortDb(), 'EpisodeNonexistent';
        episode.watched = true;
        db.update<ISerie>('media', {
            where: serieWhere(serie.id),
            set: ()=>serie
        })
        db.pushDb();
    }
}

export { 
    SerieService,
    serieMapper
}