import mongoose, { Schema, Types } from "mongoose";
import { User } from "./user.model";
import { Episode } from "./episode.model";
import { Movie } from "./movie.model";
import { CommonSanitization } from "../validation/common.sanitization";

export type Rating = {
    user:   User.Model | Types.ObjectId,
    score:  number,
    review: string
} & ({
    targetRef: Movie.Model | Types.ObjectId,
    targetKind: 'Movie'
} | {
    targetRef: Episode.Model | Types.ObjectId,
    targetKind: 'Episode'
});

export namespace Rating {
    export const schema = new Schema<Rating>({
        "user":     { type: Schema.Types.ObjectId, required: true, ref: "User" },
        "score":    { type: Number, required: true, min: 0, max: 10 },
        "review":   { type: String, required: true, min: 0, max: 2000, transform: CommonSanitization.sanitizeForHtml },
        "targetKind": {
            type: String,
            required: true,
            enum: { values: ['Movie', 'Episode'] }
        },
        "targetRef": { type: Schema.Types.ObjectId, required: true, refPath: "targetKind" }
    })
    export const Model = mongoose.model("Rating", schema);
}