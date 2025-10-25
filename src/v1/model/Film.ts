import AbstractMedia from "../core/AbstractMedia";
import type { IFilm } from "../core/IMedia";

/**
 * Model Film
 * 
 * implements `IFilm`
 */
export default class Film extends AbstractMedia implements IFilm {
    declare readonly mediaType: "film";
    public static from(data: any): Film {
        return Object.assign(Object.create(Film), data);
    }
    constructor(
        id?: string, 
        title?: string,
        genre?: string,
        year?: number,
        rating?: number,
        platform?: string,
        public duration: number = 0,
        public watched: boolean = false
    ) {
        super(id, title, genre, year, rating, platform,  "film");
    }
};