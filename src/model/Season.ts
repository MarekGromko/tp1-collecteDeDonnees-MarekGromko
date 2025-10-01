import type { ISeason, IEpisode } from "../core/IMedia.ts";
import Episode from "./Episode.ts";

/**
 * Model Season
 * 
 * implements `ISeason`
 */
export default class Season implements ISeason {
    public static from(data: any) { 
        return new Season(
            data.seasonNumber, 
            new Date(Date.parse(data.releaseDate)), 
            data.episodes?.map(Episode.from) || []
        );
    }
    constructor(
        public seasonNumber: number = 0, 
        public releaseDate: Date = new Date,
        public episodes: IEpisode[] = []
    ) {}
}