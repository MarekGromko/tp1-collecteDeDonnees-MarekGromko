import mongoose, { HydratedDocument, Schema } from "mongoose";

export interface Serie {
    title: string,
    genres: string[],
    status: 'ongoing'|'ended'
}

export namespace Serie {
    export const schema = new Schema<Serie>({
        "title":  { type: String, required: true, minLength: 1, maxLength: 200 },
        "genres": { 
            type: [{ type: String, required: true, minLength: 1, maxLength: 30}],
            required: true
        },
        "status": {
            type: String,
            required: true, 
            enum: { values: ['ongoing', 'ended'] }
        }
    }, { timestamps: true })
    schema.index({ title: "hashed" })
    schema.index({ genres: "text" })
    export const Model  = mongoose.model('Serie', schema);
    export type Model   = HydratedDocument<Serie>
}