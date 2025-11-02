import mongoose, { HydratedDocument, Schema, Types } from "mongoose"
import { CommonValidaton } from "../validation/common.validation"
import { Serie } from "src/v2/model/serie.model"
import { Movie } from "src/v2/model/movie.model"

export interface User {
    email: string,
    username: string,
    password: {
        lastAttempt: Date
        attempts: number
        digest: string
    },
    role: 'admin' | 'user'
    favorites: (
        { kind: 'Serie', itemRef: Serie.Model | Types.ObjectId } |
        { kind: 'Movie', itemRef: Movie.Model | Types.ObjectId }
    )[]
}

export namespace User {
    export const schema = new Schema<User>({
        "email":    { type: String, required: true, validators: [CommonValidaton.validateEmail] },
        "username": { type: String, required: true, validators: [CommonValidaton.validateUsername] },
        "password": { 
            "lastAttempt":  { type: Date,   required: true },
            "attempts":     { type: Number, required: true, min: 0 },
            "digest":       { type: String, required: true }
        },
        "role": {
            type: String,
            required: true,
            enum: { values: ['admin', 'user'] }
        },
        "favorites": {
            type: [{
                "kind": {
                    type: String,
                    required: true,
                    enum: { values: ["Serie", "Movie"] }
                },
                "itemRef": {
                    type: Schema.Types.ObjectId,
                    required: true,
                    refPath: 'favorites.kind'
                }
            }],
            required: true
        }
    });
    schema.index({ email: "hashed" }, { unique: true });
    schema.index({ username: "hashed" }, { unique: true })
    export const Model   = mongoose.model('User', schema);
    export type  Model = HydratedDocument<User>
}