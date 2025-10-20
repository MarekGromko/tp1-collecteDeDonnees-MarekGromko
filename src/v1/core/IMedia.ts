import AbstractMedia from "./AbstractMedia.ts";

/**
 * The status of a serie
 */
type SerieStatus = 'ongoing' | 'done';

interface IEpisode {
    id: string;
    title: string;
    duration: number;
    episodeNumber: number;
    watched: boolean;
}
interface ISeason {
    seasonNumber: number;
    releaseDate:  Date;
    episodes:     IEpisode[];
}
interface ISerie extends AbstractMedia{
    readonly mediaType: 'serie';
    status: SerieStatus
    seasons: ISeason[];
}
interface IFilm extends AbstractMedia {
    readonly mediaType: 'film';
    duration: number;
    watched: boolean;
}
/**
 * Posibily to differentiate an unknown media with the field `mediaType`
 * 
 * @example
 *  let x: UnknownMedia;
 *  if(x.mediaType === 'film') {
 *      // x' type is now infer to be IFilm
 *  } else {
 *      // x' type is now infer to be ISerie
 *  }
 */
type UnknownMedia = ISerie | IFilm;

export type {
    IEpisode,
    ISeason,
    ISerie,
    IFilm,
    UnknownMedia,
    SerieStatus
}