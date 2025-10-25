import mongoose, { Schema } from "mongoose";

export interface Serie {
    title: string,
    genres: string[],
    status: 'ongoing'|'ended'
}

export namespace Serie {
    export const schema = new Schema<Serie>({
        "title":  { type: String, required: true, minLength: 1, maxLength: 200 },
        "genres": { 
            type: [{ type: String, required: true, min: 1, max: 30}],
            required: true
        },
        "status": {
            type: String,
            required: true, 
            enum: { values: ['ongoing', 'ended'] }
        }
    })
    export const Model  = mongoose.model('Serie', schema);
    export type Model = typeof Model;
}