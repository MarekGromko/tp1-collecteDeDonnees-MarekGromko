
/**
 * Base class for all media type
 * 
 * @abstract
 * @class
 */
export default abstract class AbstractMedia {
        public readonly mediaType: string;
        public id: string;
        public title: string;
        public genre: string;
        public year: number;
        public rating: number;
        public platform: string;
    constructor(
        id: string = '', 
        title: string = '',
        genre: string = '',
        year: number = 0,
        rating: number = 0,
        platform: string = '',
        mediaType: string = '',
    ) { 
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.year = year;
        this.rating = rating;
        this.platform = platform;
        this.mediaType = mediaType;
    }
    getSummary(): string {
        return `"${this.title}" is a ${this.mediaType} released in ${this.year} of genre '${this.genre}'`;
    }
}