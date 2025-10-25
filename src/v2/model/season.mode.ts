import mongoose, { Schema, Types } from "mongoose";
import { Serie } from "./serie.model";

// seriesId (ref Series), seasonNo (≥1), episodes (nb théorique ≥0).
export interface Season {
    title: string,
    serieRef: Serie.Model | Types.ObjectId,
    seasonNb: number,
    episodeNb: number,
}

export namespace Season {
    export const schema = new Schema<Season>({
        "title":    { type: String, required: true, minLength: 1, maxLength: 200},
        "serieRef":    {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Serie",
        },
        "seasonNb":     { type: Number, required: true,  min: 1 },
        "episodeNb":    { type: Number, required: true, min: 0 }
    })
    export const Model = mongoose.model("Season", schema);
}