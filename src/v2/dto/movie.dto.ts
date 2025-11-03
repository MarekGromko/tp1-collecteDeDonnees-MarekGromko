import { Movie } from "../model/movie.model"
import ajv, { JSONSchemaType } from "../setup/ajv.setup"

export interface MovieDetailResponse {
    id: string,
    title: string,
    genres: string[],
    durationMin: number,
    synopsis: string | null,
    releasedAt: string | null
}
export namespace MovieDetailResponse {
    export const fromModel = (movie: Movie.Model)=>({
        id:             movie._id.toHexString(),
        title:          movie.title,
        genres:         movie.genres,
        durationMin:    movie.durationMin,
        synopsis:       movie.synopsis || null,
        releasedAt:      movie.releasedAt?.toISOString() || null
    });
}

export interface MovieSearchReponse {
    results:    MovieDetailResponse[],
    total:      number 
    page:       number,
    pageSize:   number
}

export interface PostMovieRequest {
    title: string,
    genres: string[],
    durationMin: number,
    synopsis?: string,
    releasedAt?: string
}
export namespace PostMovieRequest {
    export const schema: JSONSchemaType<PostMovieRequest> = {
        type: "object",
        properties: {
            "title":        { type: "string", minLength: 1, maxLength: 200 },
            "durationMin":  { type: "number", minimum: 1, maximum: 300 },
            "genres": { 
                type: "array", 
                items: { type: "string",  minLength: 1, maxLength: 30 } 
            },
            "synopsis":     { nullable: true, type: "string" },
            "releasedAt":   { nullable: true, type: "string", format: "date" }
        },
        required: ["title", "genres", "durationMin"]
    }
    export const validation = ajv.compile(schema);
}

export interface PatchMovieRequest extends Partial<PostMovieRequest> {}
export namespace PatchMovieRequest {
    export const schema: JSONSchemaType<PatchMovieRequest> = {
        type: "object",
        properties: {
            "title":        { nullable: true, type: "string", minLength: 1, maxLength: 200 },
            "durationMin":  { nullable: true, type: "number", minimum: 1, maximum: 300 },
            "genres": { 
                nullable: true,
                type: "array", 
                items: { type: "string",  minLength: 1, maxLength: 30 } 
            },
            "synopsis":     { nullable: true, type: "string" },
            "releasedAt":   { nullable: true, type: "string", format: "date" }
        },
        required: []
    }
    export const validation = ajv.compile(schema);
}