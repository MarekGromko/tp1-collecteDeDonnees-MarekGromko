import mongoose, { HydratedDocument, Schema, Types } from "mongoose";
import { Serie } from "./serie.model";

export interface Season {
    serieRef: Serie.Model | Types.ObjectId,
    seasonNo: number,
    episodeNb: number,
}
export namespace Season {
    export const schema = new Schema<Season>({
        "serieRef": {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Serie",
        },
        "seasonNo":     { type: Number, required: true, min: 1 },
        "episodeNb":    { type: Number, required: true, min: 0 }
    }, { timestamps: true })
    schema.index({ serieRef: 'hashed' });
    export const Model = mongoose.model("Season", schema);
    export type Model = HydratedDocument<Season>
}