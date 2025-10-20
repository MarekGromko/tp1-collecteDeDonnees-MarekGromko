import { IDataLayer } from "../core/IDataLayer";
import { IFilm } from "../core/IMedia";

/**
 * Service for everything Film related
 * 
 * @requires IDataLayer
 */
class FilmService {
    static readonly dependencies = ['IDataLayer'] as const;
    constructor(
        private db: IDataLayer
    ) {}
    /**
     * Add a film to database
     * 
     * @param film - film to add
     */
    addFilm(film: IFilm): void {
        this.db.insert('media', {
            values: key=>[{
                ...film,
                mediaType: 'film',
                id: key
            }]
        });
    }
}
export { 
    FilmService,
};