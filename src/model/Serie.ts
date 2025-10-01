import type { ISerie, ISeason, SerieStatus } from "../core/IMedia.ts";
import AbstractMedia from "../core/AbstractMedia.ts";
import Season from "./Season.ts";

/**
 * Model Serie
 * 
 * implements `ISerie`
 */
export default class Serie extends AbstractMedia implements ISerie {
    declare readonly mediaType: 'serie';
    public static from(data: any): Serie {
        return new Serie(data.id, data.title, data.genre, data.year, data.rating, data.platform, data.status, data.seasons.map(Season.from));
    }
    constructor(
        id?: string, 
        title?: string,
        genre?: string,
        year?: number,
        rating?: number,
        platform?: string,
        public status: SerieStatus = 'ongoing',
        public seasons: ISeason[] = []
    ) {
        super(id, title, genre, year, rating, platform, 'serie');
    }
    /**
     * Mark an episode as watched
     * @param episodeId - string, episode id
     */
    markEpisodeAsWatched(episodeId: string): void {
        this.seasons.forEach(
            season=>season.episodes.forEach(
                episode=>{
                    if(episode.id === episodeId) 
                        episode.watched = true;
                }))
    }

}