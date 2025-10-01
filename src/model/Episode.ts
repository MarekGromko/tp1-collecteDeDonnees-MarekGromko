import type { IEpisode } from "../core/IMedia.ts";

/**
 * Model Episode
 * 
 * Implements `IEpisode`
 */
export default class Episode implements IEpisode{
    public static from(data: any): Episode {
        return Object.assign(Object.create(Episode), data);
    }
    constructor(
        public id: string = '',
        public title: string = '',
        public duration: number = 0,
        public episodeNumber: number = 0,
        public watched: boolean = false
    ) { }
}