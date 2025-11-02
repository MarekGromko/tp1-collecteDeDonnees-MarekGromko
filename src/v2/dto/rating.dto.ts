import { Rating } from "../model/rating.model"
import ajv, { JSONSchemaType } from "../setup/ajv.setup"

export interface RatingDetailResponse {
    userId: string
    target: 'Movie' | 'Episode',
    targetId: string,
    score: number,
    review: string
}
export namespace RatingDetailResponse {
    export const fromModel = (model: Rating.Model): RatingDetailResponse => ({
        userId: model.userRef._id.toString('hex'),
        target: model.targetKind,
        targetId: model.targetRef._id.toString('hex'),
        score: model.score,
        review: model.review
    });
}

export interface RatingAverageResponse {
    average: number,
    count:   number
}


export interface PostRatingRequest{
    target: 'Movie' | 'Episode',
    targetId: string, 
    score: number,
    review: string
}
export namespace PostRatingRequest{
    export const schema: JSONSchemaType<PostRatingRequest> = {
        type: 'object',
        properties: {
            "target":   { type: 'string', enum: ['Movie', 'Episode'] },
            "targetId": { type: 'string', format: 'objectId' },
            "score":    { type: 'number', minimum: 0, maximum: 10},
            "review":   { type: 'string', minLength: 0, maxLength: 2000, transform: ['trim'] }
        },
        required: ["target", "targetId", "score", "review"]
    };
    export const validate = ajv.compile(schema);
}