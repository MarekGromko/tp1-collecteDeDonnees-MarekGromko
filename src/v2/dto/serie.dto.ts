import ajv, { JSONSchemaType } from "../setup/ajv.setup";
import { Serie } from "../model/serie.model";

export interface SerieDetailResponse {
    id: string,
    title: string,
    genres: string[],
    status: 'ongoing'|'ended'
}
export namespace SerieDetailResponse {
    export const fromModel = (serie: Serie.Model)=>({
        id:     serie._id.toHexString(),
        title:  serie.title,
        genres: serie.genres,
        status: serie.status
    });
}

export interface SerieSearchResponse {
    results:    SerieDetailResponse[],
    total:      number 
    page:       number,
    pageSize:   number
}

export interface PostSerieRequest {
    title:  string,
    genres: string[]
    status: 'ongoing' | 'ended'
}
export namespace PostSerieRequest {
    export const schema: JSONSchemaType<PostSerieRequest> = {
        type: "object",
        properties: {
            "title":  { type: "string", minLength: 1, maxLength: 200 },
            "genres": { 
                type: "array", 
                items: { type: "string",  minLength: 1, maxLength: 30 } 
            },
            "status": { type: "string", enum: ["ongoing", "ended"] }
        },
        required: ["title", "genres", "status"]
    }
    export const validation = ajv.compile(schema);
}