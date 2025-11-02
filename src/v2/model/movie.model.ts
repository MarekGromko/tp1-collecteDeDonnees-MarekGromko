import mongoose, { Schema } from "mongoose";

export interface Movie {
    title:  string,
    genres: string[],
    durationMin: number,
    synopsis?:      string,
    releasedAt?:   Date,
}

export namespace Movie{
    export const schema = new Schema<Movie>({
        "title":        { type: String, required: true, minLength: 1, maxLength: 200},
        "durationMin":  { type: Number, required: true, min: 1, max: 600 },
        "genres": { 
            type: [{ type: String, required: true, min: 1, max: 30}],
            required: true
        },
        "synopsis":     { type: String, required: false },
        "releasedAt":    { type: Date,   required: false }
    });
    export const Model  = mongoose.model('Movie', schema);
    export type Model   = mongoose.HydratedDocument<Movie>;
}
