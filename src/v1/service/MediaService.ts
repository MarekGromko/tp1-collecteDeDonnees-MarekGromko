import type { IDataLayer } from "../core/IDataLayer.ts";
import type { UnknownMedia } from "../core/IMedia.ts";
import Film from "../model/Film.ts";
import Serie from "../model/Serie.ts";

/**
 * Map a UnknownMedia to Film or Serie
 * @inner
 */
const mediaMapper = (data: UnknownMedia): UnknownMedia => {
    switch(data.mediaType) {
        case 'film': return Film.from(data);
        case 'serie': return Serie.from(data);
        default: return null;
    }
}

/**
 * check if `str` includes `search`
 * @inner
 */
const instr = (str: string, search: string)=>str.toLowerCase().includes(search.toLowerCase());

/**
 * Options for media search
 * @inner
 */
interface MediaSearchOptions {
    genre?: string,
    type?: string,
    title?: string,
    year?: number
}

/**
 * Service for everything media related
 * 
 * @requires IDataLayer
 */
class MediaService{
    static readonly inject = ['IDataLayer'] as const;
    constructor(
        private db: IDataLayer
    ){}
    /**
     * Get all the medias in the database
     * 
     * @returns all the medias
     */
    getAllMedias(): UnknownMedia[] {
        return this.db.read<UnknownMedia>('media', {
            map: mediaMapper
        });
    }
    /**
     * Search media based on search options
     * 
     * - `genre?` is present in
     * - `type?` is present in
     * - `title?` is present in
     * - `year?` is higher than 
     * 
     * @param opts the search options 
     * @returns all the matching medias
     */
    searchMedias(opts: MediaSearchOptions): UnknownMedia[] {
        return this.db.read<UnknownMedia>('media', {
            map: mediaMapper,
            where: row=>{
                if(opts.genre && !instr(row.genre, opts.genre)) return false;
                if(opts.type && !instr(row.mediaType, opts.type)) return false;
                if(opts.title && !instr(row.title, opts.title)) return false;
                if(opts.year && row.year >= opts.year) return false;
                return true;
            },
        });
    }
    /**
     * Get a single media by its id
     * 
     * @param id - the media id
     * @returns a single media or none
     */
    getMediaById(id: string): UnknownMedia | undefined {
        return this.db.read<UnknownMedia>('media', {
            map: mediaMapper,
            where: row=>row.id == id,
            limit: 1
        })[0];
    }
    /**
     * Add a media the the database
     * 
     * ignores field `id`
     * 
     * @param media 
     */
    addMedia(media: UnknownMedia): void {
        this.db.insert('media', {
            values: key=>[{...media, id: key}]
        });
    }
    /**
     * Modify an existing media
     * 
     * ignores field `id`
     * 
     * @param id - target media's id
     * @param media - source media
     */
    modifyMedia(id: string, media: Partial<UnknownMedia>): void {
        this.db.update<UnknownMedia>('media', {
            where: row=>row.id === id, 
            set: row=>({...row, ...media, id: row.id})
        });
    }
    /**
     * Delete a media
     * @param id - the media's id
     */
    deleteMedia(id: string): void {
        this.db.delete<UnknownMedia>('media', {
            where: row=>row.id === id
        });
    }
}

export { 
    MediaService,
    mediaMapper
};

export type {
    MediaSearchOptions
}