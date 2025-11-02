import mongoose, { HydratedDocument, Schema, Types } from "mongoose";
import { Serie } from "./serie.model";
import { Season } from "./season.mode";

// seriesId (ref), seasonId (ref), epNo (≥1), title , durationMin (1–300).
export interface Episode {
    title:      string,
    serieRef:   Serie.Model  | Types.ObjectId,
    seasonRef:  Season.Model | Types.ObjectId,
    epNo:           number,
    durationMin:    number
}

export namespace Episode {
    export const schema = new Schema<Episode>({
        "title":     { type: String,                required: true, minLength: 1, maxLength: 200},
        "serieRef":  { type: Schema.Types.ObjectId, required: true, ref: "Serie" },
        "seasonRef": { type: Schema.Types.ObjectId, required: true, ref: "Season" },
        "epNo":         { type: Number,             required: true, min: 1 },
        "durationMin":  { type: Number,             required: true, min: 1, max: 300 }
    })
    schema.index({ title:       'hashed' });
    schema.index({ serieRef:    'hashed' });
    schema.index({ seasonRef:   'hashed' });
    export const Model = mongoose.model("Episode", schema);
    export type Model = HydratedDocument<Episode>;
}
